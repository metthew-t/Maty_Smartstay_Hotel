from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, BookingViewSet, StaffRoomMonitorView, RoomMediaViewSet, RoomCategoryViewSet

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'room-media', RoomMediaViewSet)
router.register(r'room-categories', RoomCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('staff/rooms/', StaffRoomMonitorView.as_view(), name='staff-rooms-monitor'),
]
