from django.urls import path
from .views import (ServiceListView, ServiceRequestCreateView, MyServiceRequestsView,
                    MenuListView, FoodOrderCreateView, MyFoodOrdersView,
                    StaffOrderListView, StaffOrderUpdateView, StaffServiceRequestListView,
                    StaffServiceRequestUpdateView, StaffMenuItemViewSet, StaffMenuItemDetailView)

urlpatterns = [
    # Services
    path('list/', ServiceListView.as_view(), name='service-list'),
    path('request/', ServiceRequestCreateView.as_view(), name='service-request'),
    path('my-requests/', MyServiceRequestsView.as_view(), name='my-service-requests'),
    
    # Food Ordering
    path('menu/', MenuListView.as_view(), name='menu-list'),
    path('food-order/', FoodOrderCreateView.as_view(), name='food-order-create'),
    path('my-orders/', MyFoodOrdersView.as_view(), name='my-food-orders'),

    # Staff Endpoints
    path('staff/orders/', StaffOrderListView.as_view(), name='staff-orders'),
    path('staff/orders/<int:pk>/', StaffOrderUpdateView.as_view(), name='staff-order-update'),
    path('staff/requests/', StaffServiceRequestListView.as_view(), name='staff-requests'),
    path('staff/requests/<int:pk>/', StaffServiceRequestUpdateView.as_view(), name='staff-request-update'),
    path('staff/menu/', StaffMenuItemViewSet.as_view(), name='staff-menu-list'),
    path('staff/menu/<int:pk>/', StaffMenuItemDetailView.as_view(), name='staff-menu-detail'),
]
