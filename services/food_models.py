from django.db import models
from django.conf import settings

class MenuItem(models.Model):
    CATEGORY_CHOICES = (
        ('BREAKFAST', 'Breakfast'),
        ('LUNCH', 'Lunch'),
        ('DINNER', 'Dinner'),
        ('DESSERT', 'Dessert'),
        ('BEVERAGES', 'Beverages'),
        ('SNACKS', 'Snacks'),
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='menu/', null=True, blank=True)
    
    # Dietary Information
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    is_dairy_free = models.BooleanField(default=False)
    is_nut_free = models.BooleanField(default=False)
    
    allergens = models.TextField(blank=True, help_text="Comma-separated list of allergens")
    
    # Nutrition & Health Details
    ingredients = models.TextField(blank=True, help_text="List of ingredients with percentages")
    calories = models.CharField(max_length=50, blank=True, help_text="e.g. ~350-370 kcal")
    protein_pct = models.CharField(max_length=50, blank=True, help_text="e.g. ~12-15%")
    carbs_pct = models.CharField(max_length=50, blank=True, help_text="e.g. ~70-75%")
    fat_pct = models.CharField(max_length=50, blank=True, help_text="e.g. ~1-2%")
    fiber_pct = models.CharField(max_length=50, blank=True, help_text="e.g. ~3-4%")
    health_benefits = models.TextField(blank=True, help_text="Benefits of this food item")
    health_considerations = models.TextField(blank=True, help_text="Considerations (e.g. gluten, sugar)")

    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def get_dietary_tags(self):
        tags = []
        if self.is_vegetarian:
            tags.append('Vegetarian')
        if self.is_vegan:
            tags.append('Vegan')
        if self.is_gluten_free:
            tags.append('Gluten-Free')
        if self.is_dairy_free:
            tags.append('Dairy-Free')
        if self.is_nut_free:
            tags.append('Nut-Free')
        return tags

class FoodOrder(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PREPARING', 'Preparing'),
        ('READY', 'Ready'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    )
    
    guest = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='food_orders')
    booking = models.ForeignKey('booking.Booking', on_delete=models.SET_NULL, null=True, blank=True, related_name='food_orders')
    room_number = models.CharField(max_length=10, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    special_instructions = models.TextField(blank=True)
    delivery_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.guest.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(FoodOrder, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"
    
    def get_subtotal(self):
        return self.quantity * self.price
