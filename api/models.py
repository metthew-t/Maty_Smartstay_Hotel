from django.db import models

class SystemSettings(models.Model):
    site_name = models.CharField(max_length=100, default="SmartStay")
    contact_email = models.EmailField(default="admin@smartstay.com")
    maintenance_mode = models.BooleanField(default=False)
    booking_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk and SystemSettings.objects.exists():
            return SystemSettings.objects.first()
        return super().save(*args, **kwargs)

    def __str__(self):
        return "System Settings"

    class Meta:
        verbose_name = "System Settings"
        verbose_name_plural = "System Settings"
