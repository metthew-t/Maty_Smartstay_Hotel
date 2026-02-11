from rest_framework import generics, permissions
from .models import SystemSettings
from .serializers import SystemSettingsSerializer

class SystemSettingsView(generics.RetrieveUpdateAPIView):
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        obj, created = SystemSettings.objects.get_or_create(id=1)
        return obj
