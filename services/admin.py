from django.contrib import admin
from .models import Service, ServiceRequest

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'service_type', 'price', 'is_available')
    list_filter = ('service_type', 'is_available')
    search_fields = ('name', 'description')

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('guest', 'service', 'status', 'requested_datetime')
    list_filter = ('status', 'requested_datetime')
    search_fields = ('guest__email', 'service__name')