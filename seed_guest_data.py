import os
import django
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartstay.settings')
django.setup()

from services.models import Service
from services.food_models import MenuItem

def seed_guest_data():
    # Seed Services
    if not Service.objects.exists():
        print("Seeding services...")
        Service.objects.create(name='Full Housekeeping', service_type='HOUSEKEEPING', description='Complete room cleaning and linen change', price=0.00)
        Service.objects.create(name='Spa Treatment', service_type='SPA', description='60-minute relaxing massage', price=120.00)
        Service.objects.create(name='Airport Shuttle', service_type='CONCIERGE', description='Private luxury car to airport', price=50.00)
        Service.objects.create(name='Laundry Service', service_type='HOUSEKEEPING', description='Wash and fold (same day)', price=30.00)

    # Seed Food Menu
    if not MenuItem.objects.exists():
        print("Seeding menu items...")
        MenuItem.objects.create(
            name='Classic Avocado Toast', 
            description='Sourdough bread, mashed avocado, poached egg, chili flakes', 
            price=14.50, 
            category='BREAKFAST',
            is_vegetarian=True,
            is_nut_free=True
        )
        MenuItem.objects.create(
            name='Vegan Quinoa Bowl', 
            description='Quinoa, roasted vegetables, chickpeas, tahini dressing', 
            price=16.00, 
            category='LUNCH',
            is_vegetarian=True,
            is_vegan=True,
            is_gluten_free=True
        )
        MenuItem.objects.create(
            name='Grilled Salmon', 
            description='Fresh Atlantic salmon, asparagus, lemon butter sauce', 
            price=28.00, 
            category='DINNER',
            is_gluten_free=True,
            is_dairy_free=False
        )
        MenuItem.objects.create(
            name='Chicken Caesar Salad', 
            description='Romaine lettuce, grilled chicken, croutons, parmesan', 
            price=15.00, 
            category='LUNCH',
            is_nut_free=True
        )
        MenuItem.objects.create(
            name='Chocolate Lava Cake', 
            description='Warm chocolate cake with a gooey center', 
            price=10.00, 
            category='DESSERT',
            is_vegetarian=True
        )

    print("Guest data seeding completed.")

if __name__ == '__main__':
    seed_guest_data()
