"""
URL patterns for the library app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.BookCategoryViewSet, basename='bookcategory')
router.register(r'books', views.BookViewSet, basename='book')
router.register(r'borrowings', views.BookBorrowingViewSet, basename='bookborrowing')
router.register(r'reservations', views.BookReservationViewSet, basename='bookreservation')
router.register(r'fines', views.LibraryFineViewSet, basename='libraryfine')
router.register(r'settings', views.LibrarySettingsViewSet, basename='librarysettings')

urlpatterns = [
    path('', include(router.urls)),
] 