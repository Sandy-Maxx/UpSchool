"""
Views for library management.
"""
from django.utils import timezone
from django.db.models import Q, Count, Sum
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    BookCategory, Book, BookBorrowing, BookReservation, 
    LibraryFine, LibrarySettings
)
from .serializers import (
    BookCategorySerializer, BookSerializer, BookBorrowingSerializer,
    BookReservationSerializer, LibraryFineSerializer, LibrarySettingsSerializer,
    BookBorrowingCreateSerializer, BookReturnSerializer, BookRenewalSerializer
)
from core.permissions import IsTenantUser


class BookCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for BookCategory model.
    """
    serializer_class = BookCategorySerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter categories by tenant."""
        user = self.request.user
        if user.is_superuser:
            return BookCategory.objects.all()
        return BookCategory.objects.filter(book__school__tenant=user.tenant).distinct()


class BookViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Book model.
    """
    serializer_class = BookSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status', 'language', 'format']
    search_fields = ['title', 'author', 'isbn', 'publisher']
    ordering_fields = ['title', 'author', 'publication_year', 'created_at']
    ordering = ['title']

    def get_queryset(self):
        """Filter books by tenant."""
        user = self.request.user
        if user.is_superuser:
            return Book.objects.all()
        return Book.objects.filter(school__tenant=user.tenant)

    @action(detail=True, methods=['post'])
    def borrow(self, request, pk=None):
        """Borrow a book."""
        book = self.get_object()
        serializer = BookBorrowingCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Check if book is available
            if book.available_copies <= 0:
                return Response(
                    {'error': 'No copies available for borrowing'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create borrowing
            borrowing = serializer.save(
                borrowed_by=request.user,
                school=book.school
            )
            
            # Update book availability
            book.available_copies -= 1
            if book.available_copies == 0:
                book.status = 'borrowed'
            book.save()
            
            return Response(
                BookBorrowingSerializer(borrowing).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def reserve(self, request, pk=None):
        """Reserve a book."""
        book = self.get_object()
        
        # Check if user already has a reservation for this book
        existing_reservation = BookReservation.objects.filter(
            book=book,
            user=request.user,
            status='pending'
        ).first()
        
        if existing_reservation:
            return Response(
                {'error': 'You already have a reservation for this book'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create reservation
        reservation = BookReservation.objects.create(
            book=book,
            user=request.user,
            expiry_date=timezone.now() + timezone.timedelta(days=7),
            school=book.school
        )
        
        return Response(
            BookReservationSerializer(reservation).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available books."""
        queryset = self.get_queryset().filter(status='available')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get overdue books."""
        overdue_borrowings = BookBorrowing.objects.filter(
            status='borrowed',
            due_date__lt=timezone.now()
        )
        overdue_books = [borrowing.book for borrowing in overdue_borrowings]
        serializer = self.get_serializer(overdue_books, many=True)
        return Response(serializer.data)


class BookBorrowingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for BookBorrowing model.
    """
    serializer_class = BookBorrowingSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'book', 'borrower']
    search_fields = ['book__title', 'borrower__first_name', 'borrower__last_name']
    ordering_fields = ['borrowed_date', 'due_date', 'returned_date']
    ordering = ['-borrowed_date']

    def get_queryset(self):
        """Filter borrowings by tenant."""
        user = self.request.user
        if user.is_superuser:
            return BookBorrowing.objects.all()
        return BookBorrowing.objects.filter(school__tenant=user.tenant)

    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        """Return a borrowed book."""
        borrowing = self.get_object()
        serializer = BookReturnSerializer(data=request.data)
        
        if serializer.is_valid():
            # Update borrowing
            borrowing.status = 'returned'
            borrowing.returned_date = timezone.now()
            borrowing.notes = serializer.validated_data.get('notes', '')
            borrowing.save()
            
            # Update book availability
            book = borrowing.book
            book.available_copies += 1
            if book.status == 'borrowed':
                book.status = 'available'
            book.save()
            
            return Response({'message': 'Book returned successfully'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        """Renew a book borrowing."""
        borrowing = self.get_object()
        serializer = BookRenewalSerializer(data=request.data)
        
        if serializer.is_valid():
            # Check if renewal is allowed
            settings = LibrarySettings.objects.get(school=borrowing.school)
            if not settings.renewal_allowed:
                return Response(
                    {'error': 'Book renewals are not allowed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Extend due date
            extension_days = serializer.validated_data['extension_days']
            borrowing.due_date += timezone.timedelta(days=extension_days)
            borrowing.save()
            
            return Response({'message': 'Book renewed successfully'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get overdue borrowings."""
        overdue_borrowings = self.get_queryset().filter(
            status='borrowed',
            due_date__lt=timezone.now()
        )
        serializer = self.get_serializer(overdue_borrowings, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get borrowing statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_borrowings': queryset.count(),
            'active_borrowings': queryset.filter(status='borrowed').count(),
            'overdue_borrowings': queryset.filter(
                status='borrowed',
                due_date__lt=timezone.now()
            ).count(),
            'returned_borrowings': queryset.filter(status='returned').count(),
        }
        
        return Response(stats)


class BookReservationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for BookReservation model.
    """
    serializer_class = BookReservationSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'book', 'user']
    search_fields = ['book__title', 'user__first_name', 'user__last_name']
    ordering_fields = ['reserved_date', 'expiry_date']
    ordering = ['-reserved_date']

    def get_queryset(self):
        """Filter reservations by tenant."""
        user = self.request.user
        if user.is_superuser:
            return BookReservation.objects.all()
        return BookReservation.objects.filter(school__tenant=user.tenant)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a book reservation."""
        reservation = self.get_object()
        reservation.status = 'cancelled'
        reservation.save()
        return Response({'message': 'Reservation cancelled successfully'})

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending reservations."""
        pending_reservations = self.get_queryset().filter(status='pending')
        serializer = self.get_serializer(pending_reservations, many=True)
        return Response(serializer.data)


class LibraryFineViewSet(viewsets.ModelViewSet):
    """
    ViewSet for LibraryFine model.
    """
    serializer_class = LibraryFineSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['fine_type', 'paid', 'user']
    search_fields = ['user__first_name', 'user__last_name', 'description']
    ordering_fields = ['amount', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter fines by tenant."""
        user = self.request.user
        if user.is_superuser:
            return LibraryFine.objects.all()
        return LibraryFine.objects.filter(school__tenant=user.tenant)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark a fine as paid."""
        fine = self.get_object()
        fine.paid = True
        fine.paid_date = timezone.now()
        fine.save()
        return Response({'message': 'Fine marked as paid'})

    @action(detail=False, methods=['get'])
    def unpaid(self, request):
        """Get unpaid fines."""
        unpaid_fines = self.get_queryset().filter(paid=False)
        serializer = self.get_serializer(unpaid_fines, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get fine statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total_fines': queryset.count(),
            'total_amount': queryset.aggregate(total=Sum('amount'))['total'] or 0,
            'paid_fines': queryset.filter(paid=True).count(),
            'unpaid_fines': queryset.filter(paid=False).count(),
            'paid_amount': queryset.filter(paid=True).aggregate(total=Sum('amount'))['total'] or 0,
            'unpaid_amount': queryset.filter(paid=False).aggregate(total=Sum('amount'))['total'] or 0,
        }
        
        return Response(stats)


class LibrarySettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for LibrarySettings model.
    """
    serializer_class = LibrarySettingsSerializer
    permission_classes = [IsTenantUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['school__name']

    def get_queryset(self):
        """Filter settings by tenant."""
        user = self.request.user
        if user.is_superuser:
            return LibrarySettings.objects.all()
        return LibrarySettings.objects.filter(school__tenant=user.tenant) 