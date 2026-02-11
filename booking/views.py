from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Room, RoomCategory, Booking, RoomMedia
from .serializers import (
    RoomSerializer, 
    RoomCategorySerializer, 
    BookingSerializer, 
    RoomMediaSerializer
)
from smartstay.permissions import IsStaffOrAdminUser

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by('number')
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    pagination_class = None

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update', 'create']:
            return RoomSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=['get'])
    def available(self, request):
        check_in = request.query_params.get('check_in')
        check_out = request.query_params.get('check_out')

        if not check_in or not check_out:
            return Response(
                {"error": "Please provide check_in and check_out dates"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find booked rooms in the range
        booked_rooms = Booking.objects.filter(
            Q(check_in__lt=check_out) & Q(check_out__gt=check_in),
            status__in=['PENDING', 'CONFIRMED', 'CHECKED_IN']
        ).values_list('room_id', flat=True)

        # Filter available rooms
        available_rooms = Room.objects.filter(is_active=True).exclude(id__in=booked_rooms)
        
        serializer = self.get_serializer(available_rooms, many=True)
        return Response(serializer.data)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(guest=user)

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']
        
        # Calculate number of nights
        nights = (check_out - check_in).days
        if nights <= 0:
            nights = 1 # Minimum 1 night charge
            
        total_price = room.category.base_price * nights
        serializer.save(guest=self.request.user, total_price=total_price)

class RoomCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RoomCategory.objects.all()
    serializer_class = RoomCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class RoomMediaViewSet(viewsets.ModelViewSet):
    queryset = RoomMedia.objects.all()
    serializer_class = RoomMediaSerializer
    permission_classes = [IsStaffOrAdminUser]

    def perform_create(self, serializer):
        serializer.save()

class StaffRoomMonitorView(generics.ListAPIView):
    queryset = Room.objects.all().order_by('number')
    serializer_class = RoomSerializer
    permission_classes = [IsStaffOrAdminUser]
    pagination_class = None
