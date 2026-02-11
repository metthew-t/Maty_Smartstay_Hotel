import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartstay.settings')
django.setup()

from accounts.models import User

def create_staff():
    email = 'staff@smartstay.com'
    if User.objects.filter(email=email).exists():
        print(f"User {email} already exists.")
        return
    
    User.objects.create_user(
        username='staff',
        email=email,
        password='Password123!',
        role='STAFF',
        is_staff=True
    )
    print(f"Staff user {email} created with password: Password123!")

if __name__ == '__main__':
    create_staff()
