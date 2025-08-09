"""
Serializers for school models.
"""
from rest_framework import serializers
from .models import (
    School, AcademicYear, Semester, Grade, Subject, ClassRoom,
    Student, Teacher, Class, ClassSubject, StudentClass,
    Attendance, Exam, ExamResult, Fee, StudentFee
)
from accounts.serializers import UserSerializer


class SchoolSerializer(serializers.ModelSerializer):
    """
    Serializer for School model.
    """
    class Meta:
        model = School
        fields = [
            'id', 'tenant', 'name', 'code', 'address', 'phone', 'email',
            'website', 'academic_year', 'current_semester', 'school_type',
            'principal_name', 'principal_phone', 'principal_email',
            'timezone', 'language', 'currency', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AcademicYearSerializer(serializers.ModelSerializer):
    """
    Serializer for AcademicYear model.
    """
    class Meta:
        model = AcademicYear
        fields = [
            'id', 'school', 'name', 'start_date', 'end_date',
            'is_current', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SemesterSerializer(serializers.ModelSerializer):
    """
    Serializer for Semester model.
    """
    class Meta:
        model = Semester
        fields = [
            'id', 'academic_year', 'name', 'start_date', 'end_date',
            'is_current', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class GradeSerializer(serializers.ModelSerializer):
    """
    Serializer for Grade model.
    """
    class Meta:
        model = Grade
        fields = [
            'id', 'school', 'name', 'code', 'description', 'capacity',
            'current_students', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubjectSerializer(serializers.ModelSerializer):
    """
    Serializer for Subject model.
    """
    class Meta:
        model = Subject
        fields = [
            'id', 'school', 'name', 'code', 'description', 'credits',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassRoomSerializer(serializers.ModelSerializer):
    """
    Serializer for ClassRoom model.
    """
    class Meta:
        model = ClassRoom
        fields = [
            'id', 'school', 'name', 'code', 'capacity', 'room_type',
            'floor', 'building', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for Student model.
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'user', 'school', 'student_id', 'grade', 'admission_date',
            'admission_number', 'current_semester', 'academic_status',
            'date_of_birth', 'gender', 'blood_group', 'parent_name',
            'parent_phone', 'parent_email', 'emergency_contact',
            'emergency_phone', 'address', 'city', 'state', 'country',
            'postal_code', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TeacherSerializer(serializers.ModelSerializer):
    """
    Serializer for Teacher model.
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'school', 'teacher_id', 'employee_id',
            'qualification', 'specialization', 'experience_years',
            'joining_date', 'phone', 'email', 'address',
            'employment_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassSerializer(serializers.ModelSerializer):
    """
    Serializer for Class model.
    """
    class Meta:
        model = Class
        fields = [
            'id', 'school', 'grade', 'teacher', 'classroom', 'academic_year',
            'semester', 'name', 'code', 'max_students', 'current_students',
            'start_time', 'end_time', 'days_of_week', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassSubjectSerializer(serializers.ModelSerializer):
    """
    Serializer for ClassSubject model.
    """
    class Meta:
        model = ClassSubject
        fields = [
            'id', 'class_instance', 'subject', 'teacher', 'start_time',
            'end_time', 'days_of_week', 'room', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentClassSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentClass model.
    """
    class Meta:
        model = StudentClass
        fields = [
            'id', 'student', 'class_instance', 'enrollment_date',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'enrollment_date', 'created_at', 'updated_at']


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for Attendance model.
    """
    class Meta:
        model = Attendance
        fields = [
            'id', 'student', 'class_instance', 'date', 'status',
            'remarks', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExamSerializer(serializers.ModelSerializer):
    """
    Serializer for Exam model.
    """
    class Meta:
        model = Exam
        fields = [
            'id', 'school', 'name', 'description', 'exam_type',
            'subject', 'class_instance', 'exam_date', 'start_time',
            'end_time', 'total_marks', 'passing_marks',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExamResultSerializer(serializers.ModelSerializer):
    """
    Serializer for ExamResult model.
    """
    class Meta:
        model = ExamResult
        fields = [
            'id', 'exam', 'student', 'marks_obtained', 'percentage',
            'grade', 'remarks', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Fee model.
    """
    class Meta:
        model = Fee
        fields = [
            'id', 'school', 'name', 'description', 'amount', 'frequency',
            'is_optional', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentFeeSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentFee model.
    """
    class Meta:
        model = StudentFee
        fields = [
            'id', 'student', 'fee', 'academic_year', 'amount', 'due_date',
            'paid_amount', 'paid_date', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at'] 