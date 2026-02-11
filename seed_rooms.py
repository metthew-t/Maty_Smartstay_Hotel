import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartstay.settings')
django.setup()

from booking.models import Room, RoomCategory

def seed_data():
    if RoomCategory.objects.exists():
        print("Data already seeded.")
        return

    print("Seeding data...")
    cat = RoomCategory.objects.create(name='Deluxe Suite', description='A luxury suite with ocean view', base_price=250.00)
    Room.objects.create(number='101', category=cat, floor=1, capacity=2, area=55.00)
    Room.objects.create(number='102', category=cat, floor=1, capacity=2, area=55.00)
    print("Done.")

if __name__ == '__main__':
    seed_data()
