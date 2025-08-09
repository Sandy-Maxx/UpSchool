"""
School-specific models for the platform.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from core.models import BaseModel
from accounts.models import User
import uuid


class School(BaseModel):
    """
    School model for each tenant.
    """
    tenant = models.OneToOneField('core.Tenant', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    
    # Academic settings
    academic_year = models.CharField(max_length=20, default='2024-2025')
    current_semester = models.CharField(max_length=20, default='1')
    school_type = models.CharField(max_length=50, default='K-12')  # K-12, Primary, Secondary, etc.
    
    # Contact information
    principal_name = models.CharField(max_length=255, blank=True)
    principal_phone = models.CharField(max_length=20, blank=True)
    principal_email = models.EmailField(blank=True)
    
    # Settings
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    currency = models.CharField(max_length=3, default='USD')
    
    class Meta:
        db_table = 'schools'

    def __str__(self):
        return self.name


class AcademicYear(BaseModel):
    """
    Academic year model.
    """
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # e.g., "2024-2025"
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'academic_years'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.name} - {self.school.name}"


class Semester(BaseModel):
    """
    Semester model.
    """
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # e.g., "First Semester"
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'semesters'
        ordering = ['start_date']

    def __str__(self):
        return f"{self.name} - {self.academic_year.name}"


class Grade(BaseModel):
    """
    Grade/Class model.
    """
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # e.g., "Grade 1", "Class 1A"
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    capacity = models.PositiveIntegerField(default=30)
    current_students = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'grades'
        unique_together = ['school', 'code']

    def __str__(self):
        return f"{self.name} - {self.school.name}"


class Subject(BaseModel):
    """
    Subject model.
    """
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    credits = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'subjects'
        unique_together = ['school', 'code']

    def __str__(self):
        return f"{self.name} - {self.school.name}"


class ClassRoom(BaseModel):
    """
    Classroom model.
    """
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)  # e.g., "Room 101"
    code = models.CharField(max_length=20)
    capacity = models.PositiveIntegerField(default=30)
    room_type = models.CharField(max_length=50, default='Classroom')  # Classroom, Lab, Library, etc.
    floor = models.PositiveIntegerField(default=1)
    building = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'classrooms'
        unique_together = ['school', 'code']

    def __str__(self):
        return f"{self.name} - {self.school.name}"


class Student(BaseModel):
    """
    Student model.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    student_id = models.CharField(max_length=50, unique=True)
    grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True, blank=True)
    admission_date = models.DateField()
    admission_number = models.CharField(max_length=50, unique=True)
    
    # Academic information
    current_semester = models.ForeignKey(Semester, on_delete=models.SET_NULL, null=True, blank=True)
    academic_status = models.CharField(max_length=20, default='active')  # active, suspended, graduated, etc.
    
    # Personal information
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ])
    blood_group = models.CharField(max_length=5, blank=True)
    
    # Contact information
    parent_name = models.CharField(max_length=255)
    parent_phone = models.CharField(max_length=20)
    parent_email = models.EmailField(blank=True)
    emergency_contact = models.CharField(max_length=255, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    
    # Address
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='USA')
    postal_code = models.CharField(max_length=20, blank=True)
    
    class Meta:
        db_table = 'students'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.student_id}"


class Teacher(BaseModel):
    """
    Teacher model.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    teacher_id = models.CharField(max_length=50, unique=True)
    employee_id = models.CharField(max_length=50, unique=True)
    
    # Professional information
    qualification = models.CharField(max_length=255, blank=True)
    specialization = models.CharField(max_length=255, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    joining_date = models.DateField()
    
    # Contact information
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()
    
    # Status
    employment_status = models.CharField(max_length=20, default='active')  # active, inactive, retired, etc.
    
    class Meta:
        db_table = 'teachers'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.teacher_id}"


class Class(BaseModel):
    """
    Class model (specific class instance).
    """
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    classroom = models.ForeignKey(ClassRoom, on_delete=models.SET_NULL, null=True, blank=True)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    
    name = models.CharField(max_length=100)  # e.g., "Class 1A - 2024"
    code = models.CharField(max_length=50)
    max_students = models.PositiveIntegerField(default=30)
    current_students = models.PositiveIntegerField(default=0)
    
    # Schedule
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    days_of_week = models.JSONField(default=list)  # ['monday', 'wednesday', 'friday']
    
    class Meta:
        db_table = 'classes'
        unique_together = ['school', 'code']

    def __str__(self):
        return f"{self.name} - {self.school.name}"


class ClassSubject(BaseModel):
    """
    Subject taught in a specific class.
    """
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    
    # Schedule
    start_time = models.TimeField()
    end_time = models.TimeField()
    days_of_week = models.JSONField(default=list)
    room = models.ForeignKey(ClassRoom, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'class_subjects'
        unique_together = ['class_instance', 'subject']

    def __str__(self):
        return f"{self.subject.name} - {self.class_instance.name}"


class StudentClass(BaseModel):
    """
    Student enrollment in a class.
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    enrollment_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, default='enrolled')  # enrolled, dropped, graduated
    
    class Meta:
        db_table = 'student_classes'
        unique_together = ['student', 'class_instance']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.class_instance.name}"


class Attendance(BaseModel):
    """
    Student attendance model.
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused')
    ])
    remarks = models.TextField(blank=True)
    
    class Meta:
        db_table = 'attendance'
        unique_together = ['student', 'class_instance', 'date']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.date} - {self.status}"


class Exam(BaseModel):
    """
    Exam model.
    """
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    exam_type = models.CharField(max_length=50, choices=[
        ('midterm', 'Midterm'),
        ('final', 'Final'),
        ('quiz', 'Quiz'),
        ('assignment', 'Assignment'),
        ('project', 'Project')
    ])
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    
    # Schedule
    exam_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    # Grading
    total_marks = models.PositiveIntegerField()
    passing_marks = models.PositiveIntegerField()
    
    class Meta:
        db_table = 'exams'

    def __str__(self):
        return f"{self.name} - {self.subject.name}"


class ExamResult(BaseModel):
    """
    Exam result model.
    """
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=5, blank=True)
    remarks = models.TextField(blank=True)
    
    class Meta:
        db_table = 'exam_results'
        unique_together = ['exam', 'student']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.exam.name}"


class Fee(BaseModel):
    """
    Fee structure model.
    """
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)  # e.g., "Tuition Fee", "Transport Fee"
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    frequency = models.CharField(max_length=20, choices=[
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('semester', 'Semester'),
        ('yearly', 'Yearly'),
        ('one_time', 'One Time')
    ])
    is_optional = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'fees'

    def __str__(self):
        return f"{self.name} - {self.school.name}"


class StudentFee(BaseModel):
    """
    Student fee assignment model.
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    fee = models.ForeignKey(Fee, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default='unpaid', choices=[
        ('unpaid', 'Unpaid'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue')
    ])
    
    class Meta:
        db_table = 'student_fees'
        unique_together = ['student', 'fee', 'academic_year']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.fee.name}" 