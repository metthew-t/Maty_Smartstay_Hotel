from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class RoomCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    amenities = models.JSONField(default=list)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Room Categories"

class Room(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        OCCUPIED = "OCCUPIED", "Occupied"
        MAINTENANCE = "MAINTENANCE", "Under Maintenance"
        RESERVED = "RESERVED", "Reserved"

    class WindowType(models.TextChoices):
        OCEAN_VIEW = "OCEAN_VIEW", "Ocean View"
        GARDEN_VIEW = "GARDEN_VIEW", "Garden View"
        CITY_VIEW = "CITY_VIEW", "City View"
        POOL_VIEW = "POOL_VIEW", "Pool View"
        NO_WINDOW = "NO_WINDOW", "No Window"

    class RoomQuality(models.TextChoices):
        STANDARD = "STANDARD", "Standard"
        PREMIUM = "PREMIUM", "Premium"
        LUXURY = "LUXURY", "Luxury"
        VIP = "VIP", "VIP Suite"

    number = models.CharField(max_length=10, unique=True)
    category = models.ForeignKey(RoomCategory, on_delete=models.PROTECT)
    floor = models.IntegerField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.AVAILABLE
    )
    capacity = models.IntegerField(default=2)
    area = models.DecimalField(max_digits=6, decimal_places=2, help_text="In square meters")
    is_active = models.BooleanField(default=True)
    
    # Detailed room information
    description = models.TextField(blank=True, help_text="Detailed description of the room")
    temperature_setting = models.CharField(max_length=50, blank=True, default="18-24°C", help_text="Room temperature range")
    window_type = models.CharField(
        max_length=20,
        choices=WindowType.choices,
        default=WindowType.CITY_VIEW
    )
    room_quality = models.CharField(
        max_length=20,
        choices=RoomQuality.choices,
        default=RoomQuality.STANDARD
    )
    
    # Amenities provided
    has_nightwear = models.BooleanField(default=False, help_text="Nightwear/robes provided")
    has_toiletries = models.BooleanField(default=True, help_text="Toiletries provided")
    has_minibar = models.BooleanField(default=False, help_text="Minibar available")
    has_safe = models.BooleanField(default=True, help_text="In-room safe available")
    has_wifi = models.BooleanField(default=True, help_text="Free WiFi")
    has_tv = models.BooleanField(default=True, help_text="Smart TV")
    has_air_conditioning = models.BooleanField(default=True, help_text="Air conditioning")
    has_balcony = models.BooleanField(default=False, help_text="Private balcony")
    
    # Additional details
    bed_type = models.CharField(max_length=50, blank=True, default="Queen Size", help_text="Type of bed")
    bathroom_type = models.CharField(max_length=50, blank=True, default="Private", help_text="Bathroom type")
    special_features = models.TextField(blank=True, help_text="Special features of the room")
    
    def __str__(self):
        return f"Room {self.number} - {self.category.name}"

class RoomMedia(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = "IMAGE", "Image"
        VIDEO = "VIDEO", "Video"

    room = models.ForeignKey(Room, related_name='media', on_delete=models.CASCADE)
    file = models.FileField(upload_to='rooms/')
    media_type = models.CharField(
        max_length=10,
        choices=MediaType.choices,
        default=MediaType.IMAGE
    )
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.media_type} for Room {self.room.number}"

class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CHECKED_IN = "CHECKED_IN", "Checked In"
        CHECKED_OUT = "CHECKED_OUT", "Checked Out"
        CANCELLED = "CANCELLED", "Cancelled"

    guest = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='bookings', on_delete=models.CASCADE)
    room = models.ForeignKey(Room, related_name='bookings', on_delete=models.PROTECT)
    check_in = models.DateField()
    check_out = models.DateField()
    number_of_guests = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    special_requests = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.id} - {self.guest}"