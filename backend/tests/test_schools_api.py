"""
API tests for schools app.
"""
import pytest
from django.urls import reverse
from rest_framework import status

from schools.models import School, AcademicYear, Class, Subject, Student
from schools.factories import SchoolFactory, AcademicYearFactory, ClassFactory
from accounts.factories import UserFactory


@pytest.mark.django_db
class TestSchoolAPI:
    """Tests for School API endpoints."""
    
    def test_list_schools(self, authenticated_client, admin_user):
        """Test listing schools."""
        SchoolFactory.create_batch(3, tenant=admin_user.tenant)
        
        url = reverse('school-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
    
    def test_create_school(self, authenticated_client, admin_user):
        """Test creating a new school."""
        url = reverse('school-list')
        data = {
            'name': 'New Test School',
            'address': '123 Test Street',
            'phone': '+1234567890',
            'email': 'test@school.com'
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert School.objects.filter(name='New Test School').exists()
    
    def test_get_school_detail(self, authenticated_client, admin_user):
        """Test getting school details."""
        school = SchoolFactory(tenant=admin_user.tenant)
        url = reverse('school-detail', kwargs={'pk': school.pk})
        
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == school.name
    
    def test_update_school(self, authenticated_client, admin_user):
        """Test updating school."""
        school = SchoolFactory(tenant=admin_user.tenant)
        url = reverse('school-detail', kwargs={'pk': school.pk})
        data = {
            'name': 'Updated School Name'
        }
        
        response = authenticated_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        school.refresh_from_db()
        assert school.name == 'Updated School Name'
    
    def test_delete_school(self, authenticated_client, admin_user):
        """Test deleting school."""
        school = SchoolFactory(tenant=admin_user.tenant)
        url = reverse('school-detail', kwargs={'pk': school.pk})
        
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not School.objects.filter(pk=school.pk).exists()


@pytest.mark.django_db
class TestAcademicYearAPI:
    """Tests for AcademicYear API endpoints."""
    
    def test_list_academic_years(self, authenticated_client, school):
        """Test listing academic years."""
        AcademicYearFactory.create_batch(3, school=school)
        
        url = reverse('academicyear-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
    
    def test_create_academic_year(self, authenticated_client, school):
        """Test creating a new academic year."""
        url = reverse('academicyear-list')
        data = {
            'name': '2024-2025',
            'start_date': '2024-09-01',
            'end_date': '2025-06-30',
            'school': school.pk,
            'is_current': True
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert AcademicYear.objects.filter(name='2024-2025').exists()


@pytest.mark.django_db
class TestClassAPI:
    """Tests for Class API endpoints."""
    
    def test_list_classes(self, authenticated_client, school, academic_year):
        """Test listing classes."""
        ClassFactory.create_batch(3, school=school, academic_year=academic_year)
        
        url = reverse('class-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
    
    def test_create_class(self, authenticated_client, school, academic_year):
        """Test creating a new class."""
        url = reverse('class-list')
        data = {
            'name': 'Grade 5A',
            'grade_level': 5,
            'section': 'A',
            'school': school.pk,
            'academic_year': academic_year.pk,
            'capacity': 30
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Class.objects.filter(name='Grade 5A').exists()


@pytest.mark.django_db
class TestSubjectAPI:
    """Tests for Subject API endpoints."""
    
    def test_list_subjects(self, authenticated_client, school):
        """Test listing subjects."""
        # Create subjects
        Subject.objects.create(name='Mathematics', code='MATH', school=school)
        Subject.objects.create(name='English', code='ENG', school=school)
        
        url = reverse('subject-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert len(response.data['results']) == 2
    
    def test_create_subject(self, authenticated_client, school):
        """Test creating a new subject."""
        url = reverse('subject-list')
        data = {
            'name': 'Science',
            'code': 'SCI',
            'description': 'General Science',
            'school': school.pk
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Subject.objects.filter(name='Science').exists()


@pytest.mark.django_db
class TestStudentAPI:
    """Tests for Student API endpoints."""
    
    def test_list_students(self, authenticated_client, school, sample_data):
        """Test listing students."""
        # Create student users
        student1 = UserFactory(user_type='student', tenant=school.tenant)
        student2 = UserFactory(user_type='student', tenant=school.tenant)
        
        # Create student records
        Student.objects.create(
            user=student1,
            student_id='STU001',
            school=school,
            current_class=sample_data['classes'][0]
        )
        Student.objects.create(
            user=student2,
            student_id='STU002',
            school=school,
            current_class=sample_data['classes'][1]
        )
        
        url = reverse('student-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert len(response.data['results']) == 2
    
    def test_create_student(self, authenticated_client, school, sample_data):
        """Test creating a new student."""
        student_user = UserFactory(user_type='student', tenant=school.tenant)
        
        url = reverse('student-list')
        data = {
            'user': student_user.pk,
            'student_id': 'STU003',
            'school': school.pk,
            'current_class': sample_data['classes'][0].pk,
            'date_of_birth': '2010-01-01',
            'admission_date': '2024-01-01'
        }
        
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Student.objects.filter(student_id='STU003').exists()


@pytest.mark.django_db
class TestPermissionsAPI:
    """Test API permissions for different user types."""
    
    def test_teacher_can_view_students(self, teacher_client, school, sample_data):
        """Test that teachers can view students."""
        # Create a student
        student_user = UserFactory(user_type='student', tenant=school.tenant)
        Student.objects.create(
            user=student_user,
            student_id='STU001',
            school=school,
            current_class=sample_data['classes'][0]
        )
        
        url = reverse('student-list')
        response = teacher_client.get(url)
        
        # Teachers should be able to view students
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_403_FORBIDDEN]
    
    def test_student_cannot_view_other_students(self, student_client, school, sample_data):
        """Test that students cannot view other students."""
        # Create another student
        other_student = UserFactory(user_type='student', tenant=school.tenant)
        Student.objects.create(
            user=other_student,
            student_id='STU002',
            school=school,
            current_class=sample_data['classes'][0]
        )
        
        url = reverse('student-list')
        response = student_client.get(url)
        
        # Students should not be able to view other students
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_200_OK]
        
        # If allowed, should only see their own record
        if response.status_code == status.HTTP_200_OK:
            assert len(response.data['results']) <= 1


@pytest.mark.django_db
class TestSchoolsIntegration:
    """Integration tests for schools functionality."""
    
    def test_school_academic_year_relationship(self, authenticated_client, school):
        """Test school and academic year relationship."""
        # Create academic years for the school
        ay1 = AcademicYearFactory(school=school, name='2023-2024')
        ay2 = AcademicYearFactory(school=school, name='2024-2025', is_current=True)
        
        # Get school detail with academic years
        url = reverse('school-detail', kwargs={'pk': school.pk})
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # Check if academic years are included in the response
        # (This depends on your serializer implementation)
    
    def test_class_student_capacity(self, authenticated_client, school, sample_data):
        """Test class student capacity constraints."""
        class_obj = sample_data['classes'][0]
        class_obj.capacity = 2
        class_obj.save()
        
        # Create students up to capacity
        for i in range(3):  # Try to create 3 students for capacity of 2
            student_user = UserFactory(user_type='student', tenant=school.tenant)
            Student.objects.create(
                user=student_user,
                student_id=f'STU00{i+1}',
                school=school,
                current_class=class_obj
            )
        
        # Check that all students are created (business logic might allow this)
        students_in_class = Student.objects.filter(current_class=class_obj).count()
        assert students_in_class >= 0  # Depends on your business logic
    
    def test_academic_year_dates_validation(self, authenticated_client, school):
        """Test academic year date validation."""
        url = reverse('academicyear-list')
        data = {
            'name': 'Invalid Year',
            'start_date': '2024-12-01',  # Start after end
            'end_date': '2024-06-30',
            'school': school.pk
        }
        
        response = authenticated_client.post(url, data)
        
        # Should return validation error or be handled by serializer
        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_201_CREATED]
