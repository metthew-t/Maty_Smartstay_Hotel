from django.contrib import admin
from .models import Room, RoomMedia, Booking

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('number', 'category', 'floor', 'status', 'capacity')
    list_filter = ('category', 'floor', 'status')
    search_fields = ('number', 'category__name')

@admin.register(RoomMedia)
class RoomMediaAdmin(admin.ModelAdmin):
    list_display = ('room', 'media_type', 'is_primary')
    list_filter = ('media_type', 'is_primary')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('guest', 'room', 'check_in', 'check_out', 'status', 'total_price')
    list_filter = ('status', 'check_in', 'check_out')
    search_fields = ('guest__email', 'room__number')