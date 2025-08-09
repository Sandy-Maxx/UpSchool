"""
Views for school models.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    School, AcademicYear, Semester, Grade, Subject, ClassRoom,
    Student, Teacher, Class, ClassSubject, StudentClass,
    Attendance, Exam, ExamResult, Fee, StudentFee
)
from .serializers import (
    SchoolSerializer, AcademicYearSerializer, SemesterSerializer,
    GradeSerializer, SubjectSerializer, ClassRoomSerializer,
    StudentSerializer, TeacherSerializer, ClassSerializer,
    ClassSubjectSerializer, StudentClassSerializer,
    AttendanceSerializer, ExamSerializer, ExamResultSerializer,
    FeeSerializer, StudentFeeSerializer
)
from core.permissions import IsTenantUser


class SchoolViewSet(viewsets.ModelViewSet):
    """
    ViewSet for School model.
    """
    serializer_class = SchoolSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['school_type', 'is_active']
    search_fields = ['name', 'code', 'principal_name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter schools by tenant."""
        user = self.request.user
        if user.is_superuser:
            return School.objects.all()
        return School.objects.filter(tenant=user.tenant)


class AcademicYearViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AcademicYear model.
    """
    serializer_class = AcademicYearSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_current']
    search_fields = ['name']
    ordering_fields = ['start_date', 'name']
    ordering = ['-start_date']

    def get_queryset(self):
        """Filter academic years by tenant."""
        user = self.request.user
        if user.is_superuser:
            return AcademicYear.objects.all()
        return AcademicYear.objects.filter(school__tenant=user.tenant)


class SemesterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Semester model.
    """
    serializer_class = SemesterSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_current', 'academic_year']
    search_fields = ['name']
    ordering_fields = ['start_date', 'name']
    ordering = ['start_date']

    def get_queryset(self):
        """Filter semesters by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Semester.objects.all()
        return Semester.objects.filter(academic_year__school__tenant=user.tenant)


class GradeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Grade model.
    """
    serializer_class = GradeSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code']
    ordering = ['name']

    def get_queryset(self):
        """Filter grades by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Grade.objects.all()
        return Grade.objects.filter(school__tenant=user.tenant)


class SubjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Subject model.
    """
    serializer_class = SubjectSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code']
    ordering = ['name']

    def get_queryset(self):
        """Filter subjects by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Subject.objects.all()
        return Subject.objects.filter(school__tenant=user.tenant)


class ClassRoomViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ClassRoom model.
    """
    serializer_class = ClassRoomSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['room_type', 'floor']
    search_fields = ['name', 'code', 'building']
    ordering_fields = ['name', 'code', 'floor']
    ordering = ['name']

    def get_queryset(self):
        """Filter classrooms by tenant."""
        user = self.request.user
        if user.is_superuser:
            return ClassRoom.objects.all()
        return ClassRoom.objects.filter(school__tenant=user.tenant)


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Student model.
    """
    serializer_class = StudentSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['grade', 'academic_status', 'gender']
    search_fields = ['user__first_name', 'user__last_name', 'student_id', 'admission_number']
    ordering_fields = ['user__first_name', 'user__last_name', 'admission_date']
    ordering = ['user__first_name']

    def get_queryset(self):
        """Filter students by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Student.objects.all()
        return Student.objects.filter(school__tenant=user.tenant)

    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        """Get student attendance."""
        student = self.get_object()
        attendance = Attendance.objects.filter(student=student)
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """Get student exam results."""
        student = self.get_object()
        results = ExamResult.objects.filter(student=student)
        serializer = ExamResultSerializer(results, many=True)
        return Response(serializer.data)


class TeacherViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Teacher model.
    """
    serializer_class = TeacherSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['employment_status']
    search_fields = ['user__first_name', 'user__last_name', 'teacher_id', 'employee_id']
    ordering_fields = ['user__first_name', 'user__last_name', 'joining_date']
    ordering = ['user__first_name']

    def get_queryset(self):
        """Filter teachers by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Teacher.objects.all()
        return Teacher.objects.filter(school__tenant=user.tenant)


class ClassViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Class model.
    """
    serializer_class = ClassSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['grade', 'teacher', 'academic_year', 'semester']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code']
    ordering = ['name']

    def get_queryset(self):
        """Filter classes by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Class.objects.all()
        return Class.objects.filter(school__tenant=user.tenant)

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """Get students in this class."""
        class_instance = self.get_object()
        students = StudentClass.objects.filter(class_instance=class_instance)
        serializer = StudentClassSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        """Get attendance for this class."""
        class_instance = self.get_object()
        attendance = Attendance.objects.filter(class_instance=class_instance)
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)


class ClassSubjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ClassSubject model.
    """
    serializer_class = ClassSubjectSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['class_instance', 'subject', 'teacher']
    search_fields = ['subject__name', 'teacher__user__first_name']
    ordering_fields = ['start_time', 'subject__name']
    ordering = ['start_time']

    def get_queryset(self):
        """Filter class subjects by tenant."""
        user = self.request.user
        if user.is_superuser:
            return ClassSubject.objects.all()
        return ClassSubject.objects.filter(class_instance__school__tenant=user.tenant)


class StudentClassViewSet(viewsets.ModelViewSet):
    """
    ViewSet for StudentClass model.
    """
    serializer_class = StudentClassSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['class_instance', 'status']
    search_fields = ['student__user__first_name', 'student__user__last_name']
    ordering_fields = ['enrollment_date', 'student__user__first_name']
    ordering = ['enrollment_date']

    def get_queryset(self):
        """Filter student classes by tenant."""
        user = self.request.user
        if user.is_superuser:
            return StudentClass.objects.all()
        return StudentClass.objects.filter(class_instance__school__tenant=user.tenant)


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Attendance model.
    """
    serializer_class = AttendanceSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['class_instance', 'status', 'date']
    search_fields = ['student__user__first_name', 'student__user__last_name']
    ordering_fields = ['date', 'student__user__first_name']
    ordering = ['-date']

    def get_queryset(self):
        """Filter attendance by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Attendance.objects.all()
        return Attendance.objects.filter(class_instance__school__tenant=user.tenant)


class ExamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Exam model.
    """
    serializer_class = ExamSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['exam_type', 'subject', 'class_instance']
    search_fields = ['name', 'description']
    ordering_fields = ['exam_date', 'name']
    ordering = ['-exam_date']

    def get_queryset(self):
        """Filter exams by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Exam.objects.all()
        return Exam.objects.filter(school__tenant=user.tenant)


class ExamResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ExamResult model.
    """
    serializer_class = ExamResultSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['exam', 'student']
    search_fields = ['student__user__first_name', 'student__user__last_name']
    ordering_fields = ['marks_obtained', 'percentage']
    ordering = ['-marks_obtained']

    def get_queryset(self):
        """Filter exam results by tenant."""
        user = self.request.user
        if user.is_superuser:
            return ExamResult.objects.all()
        return ExamResult.objects.filter(exam__school__tenant=user.tenant)


class FeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Fee model.
    """
    serializer_class = FeeSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['frequency', 'is_optional', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'amount']
    ordering = ['name']

    def get_queryset(self):
        """Filter fees by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Fee.objects.all()
        return Fee.objects.filter(school__tenant=user.tenant)


class StudentFeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for StudentFee model.
    """
    serializer_class = StudentFeeSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['student', 'fee', 'status', 'academic_year']
    search_fields = ['student__user__first_name', 'student__user__last_name']
    ordering_fields = ['due_date', 'paid_date']
    ordering = ['-due_date']

    def get_queryset(self):
        """Filter student fees by tenant."""
        user = self.request.user
        if user.is_superuser:
            return StudentFee.objects.all()
        return StudentFee.objects.filter(student__school__tenant=user.tenant) 