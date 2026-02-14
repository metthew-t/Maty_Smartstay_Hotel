import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartstay.settings')
django.setup()

from accounts.models import User

def create_guest():
    email = 'guest@example.com'
    try:
        user = User.objects.get(email=email)
        user.set_password('Password123!')
        user.save()
        print(f"Guest user {email} updated with password: Password123!")
    except User.DoesNotExist:
        User.objects.create_user(
            username='guest',
            email=email,
            password='Password123!',
            role='GUEST',
            is_active=True
        )
        print(f"Guest user {email} created with password: Password123!")

if __name__ == '__main__':
    create_guest()
