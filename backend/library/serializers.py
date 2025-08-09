"""
Serializers for library models.
"""
from rest_framework import serializers
from .models import (
    BookCategory, Book, BookBorrowing, BookReservation, 
    LibraryFine, LibrarySettings
)


class BookCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for BookCategory model.
    """
    class Meta:
        model = BookCategory
        fields = [
            'id', 'name', 'description', 'color', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BookSerializer(serializers.ModelSerializer):
    """
    Serializer for Book model.
    """
    category_name = serializers.ReadOnlyField(source='category.name')
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'isbn', 'publisher', 'publication_year',
            'edition', 'category', 'category_name', 'pages', 'language',
            'format', 'shelf_number', 'row_number', 'status', 'status_display',
            'description', 'cover_image', 'price', 'copies', 'available_copies',
            'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'available_copies']


class BookBorrowingSerializer(serializers.ModelSerializer):
    """
    Serializer for BookBorrowing model.
    """
    book_title = serializers.ReadOnlyField(source='book.title')
    borrower_name = serializers.ReadOnlyField(source='borrower.get_full_name')
    borrowed_by_name = serializers.ReadOnlyField(source='borrowed_by.get_full_name')
    status_display = serializers.ReadOnlyField(source='get_status_display')
    is_overdue = serializers.ReadOnlyField()
    days_overdue = serializers.ReadOnlyField()

    class Meta:
        model = BookBorrowing
        fields = [
            'id', 'book', 'book_title', 'borrower', 'borrower_name',
            'borrowed_by', 'borrowed_by_name', 'borrowed_date', 'due_date',
            'returned_date', 'status', 'status_display', 'notes', 'school',
            'is_overdue', 'days_overdue', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'is_overdue', 'days_overdue'
        ]


class BookReservationSerializer(serializers.ModelSerializer):
    """
    Serializer for BookReservation model.
    """
    book_title = serializers.ReadOnlyField(source='book.title')
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    status_display = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = BookReservation
        fields = [
            'id', 'book', 'book_title', 'user', 'user_name', 'reserved_date',
            'expiry_date', 'status', 'status_display', 'school',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LibraryFineSerializer(serializers.ModelSerializer):
    """
    Serializer for LibraryFine model.
    """
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    book_title = serializers.ReadOnlyField(source='borrowing.book.title')
    fine_type_display = serializers.ReadOnlyField(source='get_fine_type_display')

    class Meta:
        model = LibraryFine
        fields = [
            'id', 'borrowing', 'user', 'user_name', 'fine_type',
            'fine_type_display', 'amount', 'description', 'paid', 'paid_date',
            'book_title', 'school', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LibrarySettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for LibrarySettings model.
    """
    school_name = serializers.ReadOnlyField(source='school.name')

    class Meta:
        model = LibrarySettings
        fields = [
            'id', 'school', 'school_name', 'max_books_per_user',
            'borrowing_duration_days', 'renewal_allowed', 'max_renewals',
            'daily_fine_rate', 'max_fine_amount', 'reservation_duration_days',
            'max_reservations_per_user', 'send_overdue_notifications',
            'send_due_date_reminders', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BookBorrowingCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating book borrowings.
    """
    class Meta:
        model = BookBorrowing
        fields = ['book', 'borrower', 'due_date', 'notes']


class BookReturnSerializer(serializers.Serializer):
    """
    Serializer for returning books.
    """
    notes = serializers.CharField(required=False, allow_blank=True)
    condition = serializers.ChoiceField(
        choices=[('good', 'Good'), ('damaged', 'Damaged'), ('lost', 'Lost')],
        default='good'
    )


class BookRenewalSerializer(serializers.Serializer):
    """
    Serializer for renewing book borrowings.
    """
    extension_days = serializers.IntegerField(min_value=1, max_value=30, default=14) 