from django.urls import path, include
from .views import SystemSettingsView

urlpatterns = [
    path('auth/', include('accounts.urls')),
    path('hotel/', include('booking.urls')),
    path('analytics/', include('analytics.urls')),
    path('settings/', SystemSettingsView.as_view(), name='system-settings'),
    path('chat/', include('chatbot.urls')),
    path('services/', include('services.urls')),
    path('payments/', include('payments.urls')),
]
