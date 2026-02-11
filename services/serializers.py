from rest_framework import serializers
from .models import Service, ServiceRequest
from .food_models import MenuItem, FoodOrder, OrderItem
from django.contrib.auth import get_user_model

User = get_user_model()

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ServiceRequestSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    
    class Meta:
        model = ServiceRequest
        fields = ['id', 'service', 'service_name', 'booking', 'status', 'requested_datetime', 'notes', 'created_at']
        read_only_fields = ['guest', 'status', 'created_at']

class MenuItemSerializer(serializers.ModelSerializer):
    dietary_tags = serializers.SerializerMethodField()
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price', 'category', 'image',
            'is_vegetarian', 'is_vegan', 'is_gluten_free', 'is_dairy_free', 'is_nut_free',
            'allergens', 'ingredients', 'calories', 'protein_pct', 'carbs_pct', 
            'fat_pct', 'fiber_pct', 'health_benefits', 'health_considerations',
            'is_available', 'dietary_tags'
        ]
    
    def get_dietary_tags(self, obj):
        return obj.get_dietary_tags()

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'quantity', 'price', 'notes', 'subtotal']
    
    def get_subtotal(self, obj):
        return obj.get_subtotal()

class FoodOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    guest_name = serializers.CharField(source='guest.username', read_only=True)
    
    class Meta:
        model = FoodOrder
        fields = ['id', 'guest', 'guest_name', 'booking', 'room_number', 'status', 'total_price', 
                  'special_instructions', 'delivery_time', 'items', 'created_at']
        read_only_fields = ['guest', 'total_price', 'created_at']

class OrderItemCreateSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    notes = serializers.CharField(required=False, allow_blank=True)

class FoodOrderCreateSerializer(serializers.Serializer):
    items = OrderItemCreateSerializer(many=True)
    room_number = serializers.CharField(required=False, allow_blank=True)
    special_instructions = serializers.CharField(required=False, allow_blank=True)
    booking = serializers.IntegerField(required=False, allow_null=True)
