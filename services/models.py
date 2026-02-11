from django.db import models
from django.conf import settings

class Service(models.Model):
    SERVICE_TYPES = (
        ('HOUSEKEEPING', 'Housekeeping'),
        ('ROOM_SERVICE', 'Room Service'),
        ('MAINTENANCE', 'Maintenance'),
        ('CONCIERGE', 'Concierge'),
        ('SPA', 'Spa'),
    )

    name = models.CharField(max_length=100)
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.DurationField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ServiceRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    guest = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='service_requests',
        on_delete=models.CASCADE
    )
    service = models.ForeignKey(
        Service,
        related_name='requests',
        on_delete=models.CASCADE
    )
    booking = models.ForeignKey(
        'booking.Booking',
        related_name='service_requests',
        on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    requested_datetime = models.DateTimeField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)