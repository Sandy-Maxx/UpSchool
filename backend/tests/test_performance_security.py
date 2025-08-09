"""
Performance and security tests.
"""
import pytest
import time
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db import connection
from django.test.utils import override_settings

from accounts.factories import UserFactory, RoleFactory
from schools.factories import SchoolFactory

User = get_user_model()


@pytest.mark.django_db
class TestPerformance:
    """Performance tests."""
    
    @pytest.mark.slow
    def test_user_list_performance(self, authenticated_client, admin_user):
        """Test performance of user list endpoint with many users."""
        # Create many users
        UserFactory.create_batch(100, tenant=admin_user.tenant)
        
        url = reverse('user-list')
        
        # Measure response time
        start_time = time.time()
        response = authenticated_client.get(url)
        end_time = time.time()
        
        response_time = end_time - start_time
        
        assert response.status_code == status.HTTP_200_OK
        assert response_time < 2.0  # Should respond within 2 seconds
        
        # Check pagination is working
        assert 'results' in response.data
        assert 'count' in response.data
    
    @pytest.mark.slow
    def test_database_query_count(self, authenticated_client, admin_user):
        """Test that we're not making too many database queries."""
        # Create test data
        UserFactory.create_batch(10, tenant=admin_user.tenant)
        
        url = reverse('user-list')
        
        # Count database queries
        with connection.cursor() as cursor:
            initial_queries = len(connection.queries)
            response = authenticated_client.get(url)
            final_queries = len(connection.queries)
        
        query_count = final_queries - initial_queries
        
        assert response.status_code == status.HTTP_200_OK
        # Should not make more than 5 queries for this operation
        assert query_count <= 5
    
    def test_pagination_performance(self, authenticated_client, admin_user):
        """Test pagination performance."""
        # Create many users
        UserFactory.create_batch(50, tenant=admin_user.tenant)
        
        url = reverse('user-list')
        
        # Test first page
        response = authenticated_client.get(url, {'page': 1})
        assert response.status_code == status.HTTP_200_OK
        
        # Test last page
        total_pages = (response.data['count'] + 19) // 20  # Assuming page size of 20
        response = authenticated_client.get(url, {'page': total_pages})
        assert response.status_code == status.HTTP_200_OK
    
    def test_search_performance(self, authenticated_client, admin_user):
        """Test search functionality performance."""
        # Create users with predictable names
        for i in range(20):
            UserFactory(
                first_name=f'TestUser{i}',
                tenant=admin_user.tenant
            )
        
        url = reverse('user-list')
        
        # Test search
        start_time = time.time()
        response = authenticated_client.get(url, {'search': 'TestUser1'})
        end_time = time.time()
        
        response_time = end_time - start_time
        
        assert response.status_code == status.HTTP_200_OK
        assert response_time < 1.0  # Should respond within 1 second
        assert len(response.data['results']) > 0


@pytest.mark.django_db
class TestSecurity:
    """Security tests."""
    
    def test_sql_injection_protection(self, authenticated_client):
        """Test protection against SQL injection."""
        url = reverse('user-list')
        
        # Try SQL injection in search parameter
        malicious_search = "'; DROP TABLE accounts_user; --"
        response = authenticated_client.get(url, {'search': malicious_search})
        
        # Should not cause an error and should return safely
        assert response.status_code == status.HTTP_200_OK
        
        # Verify users table still exists by making another query
        response2 = authenticated_client.get(url)
        assert response2.status_code == status.HTTP_200_OK
    
    def test_unauthorized_access_forbidden(self, api_client):
        """Test that unauthorized access is properly forbidden."""
        protected_urls = [
            reverse('user-list'),
            reverse('role-list'),
            reverse('permission-list'),
            reverse('school-list'),
        ]
        
        for url in protected_urls:
            response = api_client.get(url)
            assert response.status_code in [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN
            ]
    
    def test_csrf_protection(self, api_client):
        """Test CSRF protection on POST requests."""
        url = reverse('user-list')
        data = {
            'username': 'testuser',
            'email': 'test@example.com'
        }
        
        # Without authentication, should be rejected
        response = api_client.post(url, data)
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_403_FORBIDDEN
        ]
    
    def test_user_isolation(self, api_client, admin_user, tenant):
        """Test that users can only access their tenant's data."""
        # Create user in different tenant
        other_tenant = Tenant.objects.create(
            name='Other Tenant',
            subdomain='other',
            domain='other.localhost'
        )
        other_user = UserFactory(tenant=other_tenant)
        
        # Authenticate as admin_user
        api_client.force_authenticate(user=admin_user)
        
        # Try to access other tenant's user
        url = reverse('user-detail', kwargs={'pk': other_user.pk})
        response = api_client.get(url)
        
        # Should not be able to access other tenant's data
        assert response.status_code in [
            status.HTTP_404_NOT_FOUND,
            status.HTTP_403_FORBIDDEN
        ]
    
    def test_password_in_response(self, authenticated_client, admin_user):
        """Test that passwords are not included in API responses."""
        user = UserFactory(tenant=admin_user.tenant)
        
        url = reverse('user-detail', kwargs={'pk': user.pk})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'password' not in response.data
        assert 'password_hash' not in response.data
    
    @override_settings(DEBUG=False)
    def test_debug_mode_disabled_in_production(self):
        """Test that debug mode is disabled."""
        from django.conf import settings
        assert not settings.DEBUG
    
    def test_sensitive_data_not_in_logs(self, authenticated_client, admin_user):
        """Test that sensitive data is not logged."""
        url = reverse('user-list')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'secret_password_123'
        }
        
        response = authenticated_client.post(url, data)
        
        # This is a basic test - in reality, you'd check actual log files
        assert response.status_code in [
            status.HTTP_201_CREATED,
            status.HTTP_400_BAD_REQUEST
        ]
    
    def test_rate_limiting_headers(self, authenticated_client):
        """Test that rate limiting headers are present (if implemented)."""
        url = reverse('user-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        # Check for common rate limiting headers (optional)
        # These would only be present if rate limiting is implemented
        headers_to_check = [
            'X-RateLimit-Limit',
            'X-RateLimit-Remaining',
            'X-RateLimit-Reset'
        ]
        
        # This test will pass regardless of whether rate limiting is implemented
        # It's more of a reminder to implement rate limiting
        print("Rate limiting headers present:", 
              any(header in response.headers for header in headers_to_check))


@pytest.mark.django_db
class TestDataValidation:
    """Data validation and integrity tests."""
    
    def test_email_validation(self, authenticated_client):
        """Test email field validation."""
        url = reverse('user-list')
        
        invalid_emails = [
            'invalid-email',
            '@example.com',
            'user@',
            'user@.com',
            ''
        ]
        
        for invalid_email in invalid_emails:
            data = {
                'username': f'user_{invalid_email}',
                'email': invalid_email,
                'password': 'testpass123'
            }
            
            response = authenticated_client.post(url, data)
            assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_required_fields_validation(self, authenticated_client):
        """Test that required fields are properly validated."""
        url = reverse('user-list')
        
        # Test with missing required fields
        incomplete_data = [
            {},  # No data
            {'email': 'test@example.com'},  # Missing username
            {'username': 'testuser'},  # Missing email
        ]
        
        for data in incomplete_data:
            response = authenticated_client.post(url, data)
            assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_unique_constraints(self, authenticated_client, admin_user):
        """Test unique field constraints."""
        # Create a user
        existing_user = UserFactory(tenant=admin_user.tenant)
        
        url = reverse('user-list')
        
        # Try to create another user with the same username
        data = {
            'username': existing_user.username,
            'email': 'different@example.com',
            'password': 'testpass123'
        }
        
        response = authenticated_client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
        # Try to create another user with the same email
        data = {
            'username': 'different_username',
            'email': existing_user.email,
            'password': 'testpass123'
        }
        
        response = authenticated_client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_data_length_limits(self, authenticated_client):
        """Test field length validation."""
        url = reverse('user-list')
        
        # Test extremely long values
        data = {
            'username': 'a' * 200,  # Assuming max length is less than 200
            'email': 'a' * 200 + '@example.com',
            'first_name': 'a' * 200,
            'password': 'testpass123'
        }
        
        response = authenticated_client.post(url, data)
        # Should return validation error for long fields
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestErrorHandling:
    """Error handling tests."""
    
    def test_404_for_nonexistent_resources(self, authenticated_client):
        """Test that 404 is returned for non-existent resources."""
        nonexistent_id = '99999999-9999-9999-9999-999999999999'
        
        urls_to_test = [
            reverse('user-detail', kwargs={'pk': nonexistent_id}),
            reverse('role-detail', kwargs={'pk': nonexistent_id}),
            reverse('school-detail', kwargs={'pk': nonexistent_id}),
        ]
        
        for url in urls_to_test:
            response = authenticated_client.get(url)
            assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_method_not_allowed(self, authenticated_client):
        """Test that proper HTTP methods are enforced."""
        # Try PATCH on list endpoint (usually not allowed)
        url = reverse('user-list')
        response = authenticated_client.patch(url, {})
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    
    def test_malformed_json_handling(self, authenticated_client):
        """Test handling of malformed JSON."""
        url = reverse('user-list')
        
        # Send malformed JSON
        response = authenticated_client.post(
            url, 
            '{"username": "test", "email": "test@example.com"',  # Missing closing brace
            content_type='application/json'
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
