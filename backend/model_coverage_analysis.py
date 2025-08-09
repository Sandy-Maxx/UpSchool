#!/usr/bin/env python
"""
Comprehensive model coverage analysis for a full-featured SaaS school management system.
"""
import os
import sys
import django
from django.apps import apps

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_platform.settings')
django.setup()

def analyze_model_coverage():
    """Analyze model coverage for a comprehensive school management system."""
    
    print("🎓" + "="*70 + "🎓")
    print("🎓" + " "*15 + "SCHOOL MANAGEMENT SYSTEM MODEL COVERAGE" + " "*12 + "🎓")
    print("🎓" + "="*70 + "🎓")
    
    analysis = {
        'categories': {},
        'missing_models': [],
        'missing_fields': [],
        'recommendations': []
    }
    
    # 1. CORE SYSTEM MANAGEMENT
    print("\n🏢 CORE SYSTEM MANAGEMENT")
    print("="*50)
    
    core_requirements = {
        'Multi-tenancy': {'required': True, 'found': False, 'models': []},
        'User Management': {'required': True, 'found': False, 'models': []},
        'Role-Based Access Control': {'required': True, 'found': False, 'models': []},
        'System Settings': {'required': True, 'found': False, 'models': []},
        'Audit Logging': {'required': True, 'found': False, 'models': []},
        'Notifications': {'required': True, 'found': False, 'models': []}
    }
    
    # Check core models
    try:
        from core.models import Tenant, SystemSettings, AuditLog, Notification
        core_requirements['Multi-tenancy']['found'] = True
        core_requirements['Multi-tenancy']['models'].append('Tenant')
        core_requirements['System Settings']['found'] = True
        core_requirements['System Settings']['models'].append('SystemSettings')
        core_requirements['Audit Logging']['found'] = True
        core_requirements['Audit Logging']['models'].append('AuditLog')
        core_requirements['Notifications']['found'] = True
        core_requirements['Notifications']['models'].append('Notification')
    except ImportError as e:
        print(f"⚠️  Some core models missing: {e}")
    
    try:
        from accounts.models import User, Role, Permission, UserRole, RolePermission
        core_requirements['User Management']['found'] = True
        core_requirements['User Management']['models'].extend(['User', 'UserProfile', 'UserSession'])
        core_requirements['Role-Based Access Control']['found'] = True
        core_requirements['Role-Based Access Control']['models'].extend(['Role', 'Permission', 'UserRole', 'RolePermission'])
    except ImportError as e:
        print(f"⚠️  RBAC models missing: {e}")
    
    for req, details in core_requirements.items():
        status = "✅" if details['found'] else "❌"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 2. ACADEMIC MANAGEMENT
    print("\n📚 ACADEMIC MANAGEMENT")
    print("="*50)
    
    academic_requirements = {
        'School Management': {'required': True, 'found': False, 'models': []},
        'Academic Year/Terms': {'required': True, 'found': False, 'models': []},
        'Subjects/Curriculum': {'required': True, 'found': False, 'models': []},
        'Classes/Grades': {'required': True, 'found': False, 'models': []},
        'Classrooms': {'required': True, 'found': False, 'models': []},
        'Timetable/Schedule': {'required': True, 'found': False, 'models': []},
        'Departments': {'required': False, 'found': False, 'models': []},
        'Course Management': {'required': False, 'found': False, 'models': []}
    }
    
    try:
        from schools.models import School, AcademicYear, Semester, Subject, Grade, ClassRoom, Class
        academic_requirements['School Management']['found'] = True
        academic_requirements['School Management']['models'].append('School')
        academic_requirements['Academic Year/Terms']['found'] = True
        academic_requirements['Academic Year/Terms']['models'].extend(['AcademicYear', 'Semester'])
        academic_requirements['Subjects/Curriculum']['found'] = True
        academic_requirements['Subjects/Curriculum']['models'].append('Subject')
        academic_requirements['Classes/Grades']['found'] = True
        academic_requirements['Classes/Grades']['models'].extend(['Grade', 'Class'])
        academic_requirements['Classrooms']['found'] = True
        academic_requirements['Classrooms']['models'].append('ClassRoom')
        
        # Check for timetable - partially covered by ClassSubject
        from schools.models import ClassSubject
        academic_requirements['Timetable/Schedule']['found'] = True
        academic_requirements['Timetable/Schedule']['models'].append('ClassSubject')
        
    except ImportError as e:
        print(f"⚠️  Academic models missing: {e}")
    
    for req, details in academic_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 3. STUDENT MANAGEMENT
    print("\n👨‍🎓 STUDENT MANAGEMENT")
    print("="*50)
    
    student_requirements = {
        'Student Records': {'required': True, 'found': False, 'models': []},
        'Student Enrollment': {'required': True, 'found': False, 'models': []},
        'Parent/Guardian Info': {'required': True, 'found': False, 'models': []},
        'Emergency Contacts': {'required': True, 'found': False, 'models': []},
        'Medical Records': {'required': False, 'found': False, 'models': []},
        'Disciplinary Records': {'required': False, 'found': False, 'models': []},
        'Student Documents': {'required': False, 'found': False, 'models': []},
        'Alumni Management': {'required': False, 'found': False, 'models': []}
    }
    
    try:
        from schools.models import Student, StudentClass
        student_requirements['Student Records']['found'] = True
        student_requirements['Student Records']['models'].append('Student')
        student_requirements['Student Enrollment']['found'] = True
        student_requirements['Student Enrollment']['models'].append('StudentClass')
        
        # Check Student model fields for parent info
        student_fields = [f.name for f in Student._meta.fields]
        if 'parent_name' in student_fields and 'parent_phone' in student_fields:
            student_requirements['Parent/Guardian Info']['found'] = True
            student_requirements['Parent/Guardian Info']['models'].append('Student (fields)')
        
        if 'emergency_contact' in student_fields:
            student_requirements['Emergency Contacts']['found'] = True
            student_requirements['Emergency Contacts']['models'].append('Student (fields)')
            
    except ImportError as e:
        print(f"⚠️  Student models missing: {e}")
    
    for req, details in student_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 4. STAFF MANAGEMENT
    print("\n👨‍🏫 STAFF MANAGEMENT")
    print("="*50)
    
    staff_requirements = {
        'Teacher Records': {'required': True, 'found': False, 'models': []},
        'Staff Records': {'required': True, 'found': False, 'models': []},
        'Employee Contracts': {'required': False, 'found': False, 'models': []},
        'Payroll Management': {'required': False, 'found': False, 'models': []},
        'Leave Management': {'required': False, 'found': False, 'models': []},
        'Performance Reviews': {'required': False, 'found': False, 'models': []},
        'Professional Development': {'required': False, 'found': False, 'models': []}
    }
    
    try:
        from schools.models import Teacher
        staff_requirements['Teacher Records']['found'] = True
        staff_requirements['Teacher Records']['models'].append('Teacher')
        
        # Check if there's a general Staff model
        try:
            from schools.models import Staff
            staff_requirements['Staff Records']['found'] = True
            staff_requirements['Staff Records']['models'].append('Staff')
        except ImportError:
            # Staff might be handled through User model with user_type
            staff_requirements['Staff Records']['found'] = True
            staff_requirements['Staff Records']['models'].append('User (staff type)')
            
    except ImportError as e:
        print(f"⚠️  Staff models missing: {e}")
    
    for req, details in staff_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 5. ATTENDANCE MANAGEMENT
    print("\n📅 ATTENDANCE MANAGEMENT")
    print("="*50)
    
    attendance_requirements = {
        'Student Attendance': {'required': True, 'found': False, 'models': []},
        'Teacher Attendance': {'required': True, 'found': False, 'models': []},
        'Attendance Reports': {'required': True, 'found': False, 'models': []},
        'Late/Early Dismissal': {'required': False, 'found': False, 'models': []},
        'Absence Tracking': {'required': True, 'found': False, 'models': []}
    }
    
    try:
        from schools.models import Attendance
        attendance_requirements['Student Attendance']['found'] = True
        attendance_requirements['Student Attendance']['models'].append('Attendance')
        attendance_requirements['Absence Tracking']['found'] = True
        attendance_requirements['Absence Tracking']['models'].append('Attendance')
        
        # Check attendance fields
        attendance_fields = [f.name for f in Attendance._meta.fields]
        if 'status' in attendance_fields:
            attendance_requirements['Late/Early Dismissal']['found'] = True
            attendance_requirements['Late/Early Dismissal']['models'].append('Attendance (status field)')
            
    except ImportError as e:
        print(f"⚠️  Attendance models missing: {e}")
    
    for req, details in attendance_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 6. EXAMINATION & GRADING
    print("\n📊 EXAMINATION & GRADING")
    print("="*50)
    
    exam_requirements = {
        'Exam Management': {'required': True, 'found': False, 'models': []},
        'Grade Management': {'required': True, 'found': False, 'models': []},
        'Report Cards': {'required': True, 'found': False, 'models': []},
        'Assessment Types': {'required': True, 'found': False, 'models': []},
        'Grade Books': {'required': False, 'found': False, 'models': []},
        'Transcript Generation': {'required': False, 'found': False, 'models': []}
    }
    
    try:
        from schools.models import Exam, ExamResult
        exam_requirements['Exam Management']['found'] = True
        exam_requirements['Exam Management']['models'].append('Exam')
        exam_requirements['Grade Management']['found'] = True
        exam_requirements['Grade Management']['models'].append('ExamResult')
        
        # Check exam types
        exam_fields = [f.name for f in Exam._meta.fields]
        if 'exam_type' in exam_fields:
            exam_requirements['Assessment Types']['found'] = True
            exam_requirements['Assessment Types']['models'].append('Exam (exam_type field)')
            
    except ImportError as e:
        print(f"⚠️  Exam models missing: {e}")
    
    for req, details in exam_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 7. FINANCIAL MANAGEMENT
    print("\n💰 FINANCIAL MANAGEMENT")
    print("="*50)
    
    financial_requirements = {
        'Fee Structure': {'required': True, 'found': False, 'models': []},
        'Fee Collection': {'required': True, 'found': False, 'models': []},
        'Invoice Generation': {'required': True, 'found': False, 'models': []},
        'Payment Tracking': {'required': True, 'found': False, 'models': []},
        'Financial Reports': {'required': True, 'found': False, 'models': []},
        'Discount Management': {'required': False, 'found': False, 'models': []},
        'Scholarship Management': {'required': False, 'found': False, 'models': []},
        'Expense Tracking': {'required': False, 'found': False, 'models': []}
    }
    
    try:
        from schools.models import Fee, StudentFee
        financial_requirements['Fee Structure']['found'] = True
        financial_requirements['Fee Structure']['models'].append('Fee')
        financial_requirements['Fee Collection']['found'] = True
        financial_requirements['Fee Collection']['models'].append('StudentFee')
        financial_requirements['Payment Tracking']['found'] = True
        financial_requirements['Payment Tracking']['models'].append('StudentFee')
        
        # Check StudentFee fields
        student_fee_fields = [f.name for f in StudentFee._meta.fields]
        if 'status' in student_fee_fields and 'paid_amount' in student_fee_fields:
            financial_requirements['Invoice Generation']['found'] = True
            financial_requirements['Invoice Generation']['models'].append('StudentFee (payment tracking)')
            
    except ImportError as e:
        print(f"⚠️  Financial models missing: {e}")
    
    for req, details in financial_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 8. COMMUNICATION SYSTEM
    print("\n📞 COMMUNICATION SYSTEM")
    print("="*50)
    
    communication_requirements = {
        'Messaging System': {'required': True, 'found': False, 'models': []},
        'Announcements': {'required': True, 'found': False, 'models': []},
        'Parent Communication': {'required': True, 'found': False, 'models': []},
        'Email Integration': {'required': True, 'found': False, 'models': []},
        'SMS Integration': {'required': False, 'found': False, 'models': []},
        'Event Management': {'required': False, 'found': False, 'models': []},
        'Newsletter Management': {'required': False, 'found': False, 'models': []}
    }
    
    try:
        # Check if communication app exists
        communication_app = apps.get_app_config('communication')
        
        # Try to import communication models
        try:
            from communication.models import Message, Announcement
            communication_requirements['Messaging System']['found'] = True
            communication_requirements['Messaging System']['models'].append('Message')
            communication_requirements['Announcements']['found'] = True
            communication_requirements['Announcements']['models'].append('Announcement')
        except ImportError:
            pass
            
    except LookupError:
        print("⚠️  Communication app not found")
    
    for req, details in communication_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 9. LIBRARY MANAGEMENT
    print("\n📖 LIBRARY MANAGEMENT")
    print("="*50)
    
    library_requirements = {
        'Book Management': {'required': False, 'found': False, 'models': []},
        'Book Borrowing': {'required': False, 'found': False, 'models': []},
        'Fine Management': {'required': False, 'found': False, 'models': []},
        'Library Reports': {'required': False, 'found': False, 'models': []},
        'Digital Resources': {'required': False, 'found': False, 'models': []}
    }
    
    try:
        library_app = apps.get_app_config('library')
        
        try:
            from library.models import Book, BookBorrowing, Fine
            library_requirements['Book Management']['found'] = True
            library_requirements['Book Management']['models'].append('Book')
            library_requirements['Book Borrowing']['found'] = True
            library_requirements['Book Borrowing']['models'].append('BookBorrowing')
            library_requirements['Fine Management']['found'] = True
            library_requirements['Fine Management']['models'].append('Fine')
        except ImportError:
            pass
            
    except LookupError:
        print("⚠️  Library app not found")
    
    for req, details in library_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 10. TRANSPORT MANAGEMENT
    print("\n🚌 TRANSPORT MANAGEMENT")
    print("="*50)
    
    transport_requirements = {
        'Vehicle Management': {'required': False, 'found': False, 'models': []},
        'Route Management': {'required': False, 'found': False, 'models': []},
        'Driver Management': {'required': False, 'found': False, 'models': []},
        'Student Transport': {'required': False, 'found': False, 'models': []},
        'Transport Fees': {'required': False, 'found': False, 'models': []}
    }
    
    try:
        transport_app = apps.get_app_config('transport')
        
        try:
            from transport.models import Vehicle, Route, Driver
            transport_requirements['Vehicle Management']['found'] = True
            transport_requirements['Vehicle Management']['models'].append('Vehicle')
            transport_requirements['Route Management']['found'] = True
            transport_requirements['Route Management']['models'].append('Route')
            transport_requirements['Driver Management']['found'] = True
            transport_requirements['Driver Management']['models'].append('Driver')
        except ImportError:
            pass
            
    except LookupError:
        print("⚠️  Transport app not found")
    
    for req, details in transport_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # 11. REPORTING & ANALYTICS
    print("\n📈 REPORTING & ANALYTICS")
    print("="*50)
    
    reporting_requirements = {
        'Academic Reports': {'required': True, 'found': False, 'models': []},
        'Financial Reports': {'required': True, 'found': False, 'models': []},
        'Attendance Reports': {'required': True, 'found': False, 'models': []},
        'Custom Reports': {'required': False, 'found': False, 'models': []},
        'Dashboard Analytics': {'required': True, 'found': False, 'models': []},
        'Data Export': {'required': True, 'found': False, 'models': []}
    }
    
    try:
        reports_app = apps.get_app_config('reports')
        
        try:
            from reports.models import Report, Dashboard, DataExport
            reporting_requirements['Custom Reports']['found'] = True
            reporting_requirements['Custom Reports']['models'].append('Report')
            reporting_requirements['Dashboard Analytics']['found'] = True
            reporting_requirements['Dashboard Analytics']['models'].append('Dashboard')
            reporting_requirements['Data Export']['found'] = True
            reporting_requirements['Data Export']['models'].append('DataExport')
        except ImportError:
            pass
            
    except LookupError:
        print("⚠️  Reports app not found")
    
    for req, details in reporting_requirements.items():
        status = "✅" if details['found'] else "❌" if details['required'] else "⚠️"
        models_str = ", ".join(details['models']) if details['models'] else "Missing"
        print(f"{status} {req:25}: {models_str}")
    
    # SUMMARY ANALYSIS
    print("\n" + "="*70)
    print("📋 COMPREHENSIVE COVERAGE SUMMARY")
    print("="*70)
    
    all_requirements = {}
    all_requirements.update(core_requirements)
    all_requirements.update(academic_requirements)
    all_requirements.update(student_requirements)
    all_requirements.update(staff_requirements)
    all_requirements.update(attendance_requirements)
    all_requirements.update(exam_requirements)
    all_requirements.update(financial_requirements)
    all_requirements.update(communication_requirements)
    all_requirements.update(library_requirements)
    all_requirements.update(transport_requirements)
    all_requirements.update(reporting_requirements)
    
    required_count = sum(1 for req in all_requirements.values() if req['required'])
    required_found = sum(1 for req in all_requirements.values() if req['required'] and req['found'])
    optional_count = sum(1 for req in all_requirements.values() if not req['required'])
    optional_found = sum(1 for req in all_requirements.values() if not req['required'] and req['found'])
    
    total_count = len(all_requirements)
    total_found = sum(1 for req in all_requirements.values() if req['found'])
    
    required_percentage = (required_found / required_count) * 100 if required_count > 0 else 0
    optional_percentage = (optional_found / optional_count) * 100 if optional_count > 0 else 0
    overall_percentage = (total_found / total_count) * 100
    
    print(f"📊 REQUIRED FEATURES: {required_found}/{required_count} ({required_percentage:.1f}%)")
    print(f"📊 OPTIONAL FEATURES: {optional_found}/{optional_count} ({optional_percentage:.1f}%)")
    print(f"📊 OVERALL COVERAGE:  {total_found}/{total_count} ({overall_percentage:.1f}%)")
    
    # MISSING CRITICAL FEATURES
    missing_required = [name for name, req in all_requirements.items() if req['required'] and not req['found']]
    if missing_required:
        print(f"\n❌ MISSING CRITICAL FEATURES ({len(missing_required)}):")
        for feature in missing_required:
            print(f"   • {feature}")
            analysis['missing_models'].append(feature)
    
    # RECOMMENDATIONS
    print(f"\n💡 RECOMMENDATIONS:")
    
    if required_percentage >= 90:
        print("✅ Excellent coverage of required features!")
        analysis['recommendations'].append("System has excellent core feature coverage")
    elif required_percentage >= 75:
        print("✅ Good coverage of required features with minor gaps")
        analysis['recommendations'].append("Address missing required features for completeness")
    else:
        print("⚠️  Several critical features missing")
        analysis['recommendations'].append("Significant development needed for missing required features")
    
    if missing_required:
        analysis['recommendations'].extend([
            "Implement missing required features: " + ", ".join(missing_required[:3]) + ("..." if len(missing_required) > 3 else ""),
            "Consider implementing optional features for competitive advantage"
        ])
    
    # FINAL VERDICT
    print("\n" + "="*70)
    if required_percentage >= 85 and overall_percentage >= 70:
        print("🎉 VERDICT: COMPREHENSIVE SCHOOL MANAGEMENT SYSTEM")
        print("   Models cover most essential features for a full SaaS platform!")
    elif required_percentage >= 70:
        print("✅ VERDICT: SOLID FOUNDATION WITH ROOM FOR ENHANCEMENT")
        print("   Core features covered, optional features can be added incrementally.")
    elif required_percentage >= 50:
        print("⚠️  VERDICT: GOOD START BUT MISSING KEY FEATURES")
        print("   Several important features missing for a complete system.")
    else:
        print("❌ VERDICT: INCOMPLETE SYSTEM")
        print("   Significant features missing for a comprehensive school management system.")
    
    print(f"📈 Model Coverage Score: {overall_percentage:.1f}%")
    print("="*70)
    
    return overall_percentage, analysis

if __name__ == "__main__":
    coverage_score, analysis = analyze_model_coverage()
    sys.exit(0 if coverage_score >= 70 else 1)
