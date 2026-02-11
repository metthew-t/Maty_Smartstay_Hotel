import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartstay.settings')
django.setup()

from booking.models import Room, RoomCategory

def seed_data():
    print("Clearing existing room data...")
    Room.objects.all().delete()
    RoomCategory.objects.all().delete()

    print("Seeding categories...")
    categories = [
        {'name': 'Standard Single', 'description': 'Comfortable single room for solo travelers', 'base_price': 80.00, 'capacity': 1, 'area': 20.00},
        {'name': 'Standard Double', 'description': 'Spacious double room for couples', 'base_price': 120.00, 'capacity': 2, 'area': 30.00},
        {'name': 'Deluxe Suite', 'description': 'Luxury suite with premium amenities and ocean view', 'base_price': 250.00, 'capacity': 2, 'area': 55.00},
        {'name': 'Family Room', 'description': 'Large room for families with kids', 'base_price': 180.00, 'capacity': 4, 'area': 45.00},
        {'name': 'Executive Lounge', 'description': 'Premium room with access to executive lounge', 'base_price': 350.00, 'capacity': 2, 'area': 65.00},
    ]

    cat_objs = {}
    for cat_data in categories:
        cat = RoomCategory.objects.create(
            name=cat_data['name'], 
            description=cat_data['description'], 
            base_price=cat_data['base_price']
        )
        cat_objs[cat_data['name']] = cat

    print("Seeding rooms...")
    rooms_data = [
        {'number': '101', 'category': 'Standard Single', 'floor': 1, 'capacity': 1, 'area': 20.00},
        {'number': '102', 'category': 'Standard Single', 'floor': 1, 'capacity': 1, 'area': 20.00},
        {'number': '103', 'category': 'Standard Double', 'floor': 1, 'capacity': 2, 'area': 30.00},
        {'number': '104', 'category': 'Standard Double', 'floor': 1, 'capacity': 2, 'area': 30.00},
        {'number': '201', 'category': 'Deluxe Suite', 'floor': 2, 'capacity': 2, 'area': 55.00},
        {'number': '202', 'category': 'Deluxe Suite', 'floor': 2, 'capacity': 2, 'area': 55.00},
        {'number': '203', 'category': 'Family Room', 'floor': 2, 'capacity': 4, 'area': 45.00},
        {'number': '204', 'category': 'Family Room', 'floor': 2, 'capacity': 4, 'area': 45.00},
        {'number': '301', 'category': 'Executive Lounge', 'floor': 3, 'capacity': 2, 'area': 65.00},
        {'number': '302', 'category': 'Executive Lounge', 'floor': 3, 'capacity': 2, 'area': 65.00},
        {'number': '303', 'category': 'Deluxe Suite', 'floor': 3, 'capacity': 2, 'area': 55.00},
        {'number': '304', 'category': 'Standard Double', 'floor': 3, 'capacity': 2, 'area': 30.00},
    ]

    for room_data in rooms_data:
        Room.objects.create(
            number=room_data['number'],
            category=cat_objs[room_data['category']],
            floor=room_data['floor'],
            capacity=room_data['capacity'],
            area=room_data['area'],
            status=random.choice(['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'OCCUPIED', 'MAINTENANCE'])
        )

    print(f"Successfully seeded {len(rooms_data)} rooms.")

if __name__ == '__main__':
    seed_data()
