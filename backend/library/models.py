"""
Library models for book management.
"""
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from core.models import BaseModel


class BookCategory(BaseModel):
    """
    Book category model.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007bff')  # Hex color code

    class Meta:
        db_table = 'book_categories'
        verbose_name_plural = 'Book Categories'

    def __str__(self):
        return self.name


class Book(BaseModel):
    """
    Book model for library management.
    """
    BOOK_STATUS_CHOICES = [
        ('available', 'Available'),
        ('borrowed', 'Borrowed'),
        ('lost', 'Lost'),
        ('damaged', 'Damaged'),
        ('reserved', 'Reserved'),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, blank=True)
    publisher = models.CharField(max_length=255, blank=True)
    publication_year = models.PositiveIntegerField(null=True, blank=True)
    edition = models.CharField(max_length=50, blank=True)
    category = models.ForeignKey(BookCategory, on_delete=models.CASCADE)
    
    # Physical details
    pages = models.PositiveIntegerField(null=True, blank=True)
    language = models.CharField(max_length=50, default='English')
    format = models.CharField(max_length=50, default='Hardcover')  # Hardcover, Paperback, E-book
    
    # Location and status
    shelf_number = models.CharField(max_length=50, blank=True)
    row_number = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=BOOK_STATUS_CHOICES, default='available')
    
    # Additional details
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    copies = models.PositiveIntegerField(default=1)
    available_copies = models.PositiveIntegerField(default=1)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'books'
        ordering = ['title']

    def __str__(self):
        return f"{self.title} by {self.author}"

    def save(self, *args, **kwargs):
        if not self.available_copies:
            self.available_copies = self.copies
        super().save(*args, **kwargs)


class BookBorrowing(BaseModel):
    """
    Book borrowing model.
    """
    BORROWING_STATUS_CHOICES = [
        ('borrowed', 'Borrowed'),
        ('returned', 'Returned'),
        ('overdue', 'Overdue'),
        ('lost', 'Lost'),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    borrowed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='borrowings_created'
    )
    
    # Dates
    borrowed_date = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField()
    returned_date = models.DateTimeField(null=True, blank=True)
    
    # Status and notes
    status = models.CharField(max_length=20, choices=BORROWING_STATUS_CHOICES, default='borrowed')
    notes = models.TextField(blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'book_borrowings'
        ordering = ['-borrowed_date']

    def __str__(self):
        return f"{self.book.title} - {self.borrower.get_full_name()}"

    @property
    def is_overdue(self):
        """Check if the book is overdue."""
        if self.status == 'borrowed' and timezone.now() > self.due_date:
            return True
        return False

    @property
    def days_overdue(self):
        """Calculate days overdue."""
        if self.is_overdue:
            return (timezone.now() - self.due_date).days
        return 0


class BookReservation(BaseModel):
    """
    Book reservation model.
    """
    RESERVATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reserved_date = models.DateTimeField(default=timezone.now)
    expiry_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=RESERVATION_STATUS_CHOICES, default='pending')
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'book_reservations'
        ordering = ['-reserved_date']

    def __str__(self):
        return f"{self.book.title} - {self.user.get_full_name()}"


class LibraryFine(BaseModel):
    """
    Library fine model.
    """
    FINE_TYPE_CHOICES = [
        ('overdue', 'Overdue'),
        ('damage', 'Damage'),
        ('lost', 'Lost'),
    ]

    borrowing = models.ForeignKey(BookBorrowing, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fine_type = models.CharField(max_length=20, choices=FINE_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    paid = models.BooleanField(default=False)
    paid_date = models.DateTimeField(null=True, blank=True)
    
    # School association
    school = models.ForeignKey('schools.School', on_delete=models.CASCADE)

    class Meta:
        db_table = 'library_fines'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.amount}"


class LibrarySettings(BaseModel):
    """
    Library settings model.
    """
    school = models.OneToOneField('schools.School', on_delete=models.CASCADE)
    
    # Borrowing settings
    max_books_per_user = models.PositiveIntegerField(default=3)
    borrowing_duration_days = models.PositiveIntegerField(default=14)
    renewal_allowed = models.BooleanField(default=True)
    max_renewals = models.PositiveIntegerField(default=2)
    
    # Fine settings
    daily_fine_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.50)
    max_fine_amount = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    
    # Reservation settings
    reservation_duration_days = models.PositiveIntegerField(default=7)
    max_reservations_per_user = models.PositiveIntegerField(default=2)
    
    # Notification settings
    send_overdue_notifications = models.BooleanField(default=True)
    send_due_date_reminders = models.BooleanField(default=True)

    class Meta:
        db_table = 'library_settings'
        verbose_name_plural = 'Library Settings'

    def __str__(self):
        return f"Library Settings - {self.school.name}" 