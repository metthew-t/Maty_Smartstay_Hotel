from rest_framework import generics, permissions, status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Service, ServiceRequest
from .food_models import MenuItem, FoodOrder, OrderItem
from .serializers import (ServiceSerializer, ServiceRequestSerializer, 
                          MenuItemSerializer, FoodOrderSerializer, FoodOrderCreateSerializer)
from django.db.models import Q
from smartstay.permissions import IsStaffOrAdminUser

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.filter(is_available=True).order_by('name')
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

class ServiceRequestCreateView(generics.CreateAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(guest=self.request.user)

class MyServiceRequestsView(generics.ListAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        return ServiceRequest.objects.filter(guest=self.request.user)

# Food Ordering Views
class MenuListView(generics.ListAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        queryset = MenuItem.objects.filter(is_available=True).order_by('category', 'name')
        
        # Filter by dietary preferences
        if self.request.query_params.get('vegetarian') == 'true':
            queryset = queryset.filter(is_vegetarian=True)
        if self.request.query_params.get('vegan') == 'true':
            queryset = queryset.filter(is_vegan=True)
        if self.request.query_params.get('gluten_free') == 'true':
            queryset = queryset.filter(is_gluten_free=True)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset

class FoodOrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = FoodOrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            items_data = serializer.validated_data['items']
            
            # Calculate total
            total_price = 0
            for item in items_data:
                menu_item = get_object_or_404(MenuItem, id=item['menu_item_id'])
                total_price += menu_item.price * item['quantity']
            
            # Create order
            order = FoodOrder.objects.create(
                guest=request.user,
                total_price=total_price,
                room_number=serializer.validated_data.get('room_number', ''),
                special_instructions=serializer.validated_data.get('special_instructions', '')
            )
            
            # Create order items
            for item in items_data:
                menu_item = MenuItem.objects.get(id=item['menu_item_id'])
                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=item['quantity'],
                    price=menu_item.price,
                    notes=item.get('notes', '')
                )
            
            return Response(FoodOrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyFoodOrdersView(generics.ListAPIView):
    serializer_class = FoodOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        return FoodOrder.objects.filter(guest=self.request.user)

# Staff Specific Management Views
class StaffOrderListView(generics.ListAPIView):
    queryset = FoodOrder.objects.all().order_by('-created_at')
    serializer_class = FoodOrderSerializer
    permission_classes = [IsStaffOrAdminUser]
    pagination_class = None

class StaffOrderUpdateView(generics.UpdateAPIView):
    queryset = FoodOrder.objects.all()
    serializer_class = FoodOrderSerializer
    permission_classes = [IsStaffOrAdminUser]
    
    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
            return Response(FoodOrderSerializer(order).data)
        return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)

class StaffServiceRequestListView(generics.ListAPIView):
    queryset = ServiceRequest.objects.all().order_by('-requested_datetime')
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsStaffOrAdminUser]
    pagination_class = None

class StaffServiceRequestUpdateView(generics.UpdateAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsStaffOrAdminUser]

# Full Menu CRUD for Staff
class StaffMenuItemViewSet(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all().order_by('category', 'name')
    serializer_class = MenuItemSerializer
    permission_classes = [IsStaffOrAdminUser]
    pagination_class = None

class StaffMenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsStaffOrAdminUser]
