"""
URL patterns for the schools app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'schools', views.SchoolViewSet, basename='school')
router.register(r'academic-years', views.AcademicYearViewSet, basename='academicyear')
router.register(r'semesters', views.SemesterViewSet, basename='semester')
router.register(r'grades', views.GradeViewSet, basename='grade')
router.register(r'subjects', views.SubjectViewSet, basename='subject')
router.register(r'classrooms', views.ClassRoomViewSet, basename='classroom')
router.register(r'students', views.StudentViewSet, basename='student')
router.register(r'teachers', views.TeacherViewSet, basename='teacher')
router.register(r'classes', views.ClassViewSet, basename='class')
router.register(r'class-subjects', views.ClassSubjectViewSet, basename='classsubject')
router.register(r'student-classes', views.StudentClassViewSet, basename='studentclass')
router.register(r'attendance', views.AttendanceViewSet, basename='attendance')
router.register(r'exams', views.ExamViewSet, basename='exam')
router.register(r'exam-results', views.ExamResultViewSet, basename='examresult')
router.register(r'fees', views.FeeViewSet, basename='fee')
router.register(r'student-fees', views.StudentFeeViewSet, basename='studentfee')

urlpatterns = [
    path('', include(router.urls)),
] 