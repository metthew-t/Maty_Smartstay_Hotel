from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth import get_user_model
from booking.models import Booking
from django.db.models import Sum

User = get_user_model()

class AnalyticsDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_bookings = Booking.objects.count()
        
        revenue_data = Booking.objects.aggregate(total_revenue=Sum('total_price'))
        revenue = revenue_data['total_revenue'] or 0
        
        recent_signups = User.objects.order_by('-date_joined')[:5].values('id', 'username', 'email', 'date_joined')
        
        data = {
            "total_users": total_users,
            "total_bookings": total_bookings,
            "revenue": revenue,
            "recent_signups": recent_signups
        }
        return Response(data)
