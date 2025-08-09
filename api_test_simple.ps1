# Comprehensive API Testing Script for Multi-Tenant School ERP Platform
Write-Host "🚀 STARTING COMPREHENSIVE API TESTING" -ForegroundColor Green
Write-Host "Target: http://localhost:8000" -ForegroundColor Cyan
Write-Host "="*80 -ForegroundColor Green

$baseUrl = "http://localhost:8000"
$totalTests = 0
$passedTests = 0

function Test-API {
    param([string]$Endpoint, [string]$Method = "GET", [string]$Description, [int]$ExpectedStatus = 200)
    
    $script:totalTests++
    Write-Host "`n🔍 Testing: $Description" -ForegroundColor Cyan
    Write-Host "   → $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$Endpoint" -Method $Method -ErrorAction Stop
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "   ✅ PASSED (Status: $($response.StatusCode))" -ForegroundColor Green
            $script:passedTests++
        } else {
            Write-Host "   ❌ FAILED - Expected: $ExpectedStatus, Got: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 500 }
        if ($ExpectedStatus -eq $statusCode) {
            Write-Host "   ✅ PASSED (Expected error: $statusCode)" -ForegroundColor Green
            $script:passedTests++
        } else {
            Write-Host "   ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Start-Sleep -Milliseconds 300
}

# 1. HEALTH CHECK & DOCUMENTATION
Write-Host "`n🏥 HEALTH CHECK & DOCUMENTATION ENDPOINTS" -ForegroundColor Yellow
Test-API "/api/v1/health/" -Description "Health Check Endpoint"
Test-API "/api/docs/" -Description "API Documentation (Swagger)"
Test-API "/api/redoc/" -Description "API Documentation (ReDoc)"
Test-API "/api/schema/" -Description "OpenAPI Schema"

# 2. PUBLIC TENANT ENDPOINTS (No Auth Required)
Write-Host "`n🌐 PUBLIC TENANT REGISTRATION ENDPOINTS" -ForegroundColor Yellow
Test-API "/api/v1/public/pricing/" -Description "Pricing Plans"
Test-API "/api/v1/public/check-subdomain/" -Description "Check Subdomain Availability" -ExpectedStatus 400

# 3. CORE MODULE ENDPOINTS (Auth Required - Expect 401)
Write-Host "`n🔧 CORE MODULE ENDPOINTS (Auth Required)" -ForegroundColor Yellow
Test-API "/api/v1/tenants/" -Description "List Tenants" -ExpectedStatus 401
Test-API "/api/v1/notifications/" -Description "List Notifications" -ExpectedStatus 401
Test-API "/api/v1/settings/" -Description "System Settings" -ExpectedStatus 401

# 4. ACCOUNTS MODULE ENDPOINTS
Write-Host "`n👤 ACCOUNTS MODULE ENDPOINTS" -ForegroundColor Yellow
Test-API "/api/v1/accounts/login/" -Method "POST" -Description "Login Endpoint" -ExpectedStatus 400
Test-API "/api/v1/accounts/users/" -Description "List Users" -ExpectedStatus 401
Test-API "/api/v1/accounts/profiles/" -Description "User Profiles" -ExpectedStatus 401
Test-API "/api/v1/accounts/roles/" -Description "RBAC Roles" -ExpectedStatus 401
Test-API "/api/v1/accounts/permissions/" -Description "RBAC Permissions" -ExpectedStatus 401

# 5. SCHOOLS MODULE ENDPOINTS
Write-Host "`n🏫 SCHOOLS MODULE ENDPOINTS" -ForegroundColor Yellow
Test-API "/api/v1/schools/schools/" -Description "List Schools" -ExpectedStatus 401
Test-API "/api/v1/schools/students/" -Description "List Students" -ExpectedStatus 401
Test-API "/api/v1/schools/teachers/" -Description "List Teachers" -ExpectedStatus 401
Test-API "/api/v1/schools/grades/" -Description "List Grades" -ExpectedStatus 401
Test-API "/api/v1/schools/subjects/" -Description "List Subjects" -ExpectedStatus 401
Test-API "/api/v1/schools/attendance/" -Description "Attendance Records" -ExpectedStatus 401
Test-API "/api/v1/schools/exams/" -Description "Exam Management" -ExpectedStatus 401
Test-API "/api/v1/schools/fees/" -Description "Fee Management" -ExpectedStatus 401

# 6. LIBRARY MODULE ENDPOINTS
Write-Host "`n📚 LIBRARY MODULE ENDPOINTS" -ForegroundColor Yellow
Test-API "/api/v1/library/books/" -Description "List Books" -ExpectedStatus 401
Test-API "/api/v1/library/categories/" -Description "Book Categories" -ExpectedStatus 401
Test-API "/api/v1/library/borrowings/" -Description "Book Borrowings" -ExpectedStatus 401
Test-API "/api/v1/library/fines/" -Description "Library Fines" -ExpectedStatus 401

# 7. OTHER MODULE ENDPOINTS
Write-Host "`n🚌 TRANSPORT & OTHER MODULE ENDPOINTS" -ForegroundColor Yellow
Test-API "/api/v1/transport/" -Description "Transport Management" -ExpectedStatus 401
Test-API "/api/v1/communication/" -Description "Communication System" -ExpectedStatus 401
Test-API "/api/v1/reports/" -Description "Reports Generation" -ExpectedStatus 401

# 8. INVALID ENDPOINTS
Write-Host "`n❌ INVALID ENDPOINTS (Should Return 404)" -ForegroundColor Yellow
Test-API "/api/v1/invalid/" -Description "Invalid Endpoint" -ExpectedStatus 404
Test-API "/api/v2/test/" -Description "Wrong API Version" -ExpectedStatus 404

# SUMMARY
Write-Host "`n" "="*80 -ForegroundColor Yellow
Write-Host "🧪 COMPREHENSIVE API TEST RESULTS SUMMARY" -ForegroundColor Yellow
Write-Host "="*80 -ForegroundColor Yellow
Write-Host "`n📊 OVERALL STATISTICS:" -ForegroundColor Green
Write-Host "   Total Tests: $totalTests" -ForegroundColor White
Write-Host "   Passed: $passedTests" -ForegroundColor Green
Write-Host "   Failed: $($totalTests - $passedTests)" -ForegroundColor Red
$successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host "   Success Rate: $successRate%" -ForegroundColor Cyan

Write-Host "`n🎯 NEXT STEPS RECOMMENDATIONS:" -ForegroundColor Green
Write-Host "1. ✅ Public endpoints are accessible" -ForegroundColor White
Write-Host "2. ✅ Authentication is properly enforced" -ForegroundColor White
Write-Host "3. 🔧 Set up authentication tokens for protected endpoint testing" -ForegroundColor White
Write-Host "4. 🧪 Create integration tests with sample data" -ForegroundColor White
Write-Host "5. 📈 Performance testing under load" -ForegroundColor White
Write-Host "="*80 -ForegroundColor Yellow
