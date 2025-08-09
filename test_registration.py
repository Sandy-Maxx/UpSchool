#!/usr/bin/env python3
"""
Test script for tenant registration API
"""
import requests
import json

# Test 1: Check pricing endpoint
print("=== Testing Pricing Endpoint ===")
try:
    response = requests.get("http://localhost:8000/api/v1/public/pricing/")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        pricing_data = response.json()
        print(f"Available plans: {len(pricing_data.get('plans', []))}")
        for plan in pricing_data.get('plans', [])[:2]:
            print(f"  - {plan['name']}: ${plan['price']}/month")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Check subdomain availability
print("\n=== Testing Subdomain Check ===")
try:
    subdomain_data = {"subdomain": "testschool123"}
    response = requests.post(
        "http://localhost:8000/api/v1/public/check-subdomain/", 
        json=subdomain_data
    )
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Subdomain 'testschool123' available: {result.get('available')}")
        print(f"URL Preview: {result.get('url_preview')}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error: {e}")

# Test 3: Test tenant registration
print("\n=== Testing Tenant Registration ===")
try:
    registration_data = {
        "school_name": "New Test School",
        "subdomain": "newtestschool2025",
        "school_address": "456 Learning Ave, Education City, EC 67890, USA",
        "school_phone": "+1-555-987-6543",
        "school_email": "principal@newtestschool2025.edu",
        "school_website": "https://newtestschool2025.edu",
        "subscription_plan": "standard",
        "admin_first_name": "Jane",
        "admin_last_name": "Smith", 
        "admin_email": "principal@newtestschool2025.edu",
        "admin_phone": "+1-555-987-6543",
        "admin_password": "NewSecurePass456!",
        "terms_accepted": True
    }
    
    print("Registration data:", json.dumps(registration_data, indent=2))
    
    response = requests.post(
        "http://localhost:8000/api/v1/public/register/",
        json=registration_data
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        result = response.json()
        print("Registration successful!")
        if result.get('success'):
            tenant_info = result.get('tenant', {})
            print(f"Tenant ID: {tenant_info.get('id')}")
            print(f"Subdomain: {tenant_info.get('subdomain')}")
            print(f"URL: {tenant_info.get('url')}")
        
except Exception as e:
    print(f"Error: {e}")

print("\n=== Test Complete ===")
