from rest_framework import serializers
from .models import Room, RoomCategory, Booking, RoomMedia

class RoomCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomCategory
        fields = '__all__'

class RoomMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomMedia
        fields = ['id', 'room', 'file', 'media_type', 'is_primary']

class RoomSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    price = serializers.DecimalField(source='category.base_price', max_digits=10, decimal_places=2, read_only=True)
    category = RoomCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=RoomCategory.objects.all(), source='category', write_only=True, required=False)
    media = RoomMediaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Room
        fields = [
            'id', 'number', 'category', 'category_id', 'category_name', 'price', 
            'floor', 'status', 'capacity', 'area', 'is_active', 'media',
            # Detailed room information
            'description', 'temperature_setting', 'window_type', 'room_quality',
            # Amenities
            'has_nightwear', 'has_toiletries', 'has_minibar', 'has_safe',
            'has_wifi', 'has_tv', 'has_air_conditioning', 'has_balcony',
            # Additional details
            'bed_type', 'bathroom_type', 'special_features'
        ]

class BookingSerializer(serializers.ModelSerializer):
    room_number = serializers.CharField(source='room.number', read_only=True)
    room_category = serializers.CharField(source='room.category.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'guest', 'room', 'room_number', 'room_category', 'check_in', 'check_out', 'number_of_guests', 'total_price', 'status', 'special_requests', 'created_at']
        read_only_fields = ['guest', 'total_price']
