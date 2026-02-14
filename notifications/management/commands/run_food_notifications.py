from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from notifications.models import Notification
from services.food_models import MenuItem
from accounts.models import User
import time
from datetime import datetime

class Command(BaseCommand):
    help = 'Sends automated food notifications during meal times'

    def add_arguments(self, parser):
        parser.add_argument(
            '--now',
            action='store_true',
            help='Force send notification immediately for testing',
        )
        parser.add_argument(
            '--meal',
            type=str,
            choices=['BREAKFAST', 'LUNCH', 'DINNER'],
            help='Specify meal type for forced notification (default based on time)',
        )

    def handle(self, *args, **options):
        self.stdout.write('Starting food notification service...')
        
        while True:
            now = timezone.localtime()
            current_hour = now.hour
            
            meal_type = None
            if options['now']:
                if options['meal']:
                    meal_type = options['meal']
                else:
                    # Guess meal based on time, fallback to LUNCH
                    if 6 <= current_hour < 11:
                        meal_type = 'BREAKFAST'
                    elif 11 <= current_hour < 16:
                        meal_type = 'LUNCH'
                    elif 18 <= current_hour < 22:
                        meal_type = 'DINNER'
                    else:
                        meal_type = 'LUNCH'
            else:
                # Schedule times
                if 7 <= current_hour < 9:
                    meal_type = 'BREAKFAST'
                elif 12 <= current_hour < 14:
                    meal_type = 'LUNCH'
                elif 19 <= current_hour < 21:
                    meal_type = 'DINNER'

            if meal_type:
                self.check_and_send_notifications(meal_type, force=options['now'])
            
            if options['now']:
                self.stdout.write(self.style.SUCCESS('Forced notification check complete.'))
                break
            
            # Sleep for 5 minutes before next check
            time.sleep(300)

    def check_and_send_notifications(self, meal_type, force=False):
        today = timezone.now().date()
        notification_title = f"{meal_type.title()} Menu Available!"
        
        # Check if we already sent this notification type today (unless forced)
        # We query just one user to see if a system notification exists for today
        # But properly we should check each user. For simplicity in this demo,
        # we'll assume if we generated a notification record for 'admin' or similar, we did it.
        # Better: Check existing System notifications for this specific type/date.
        
        # Strategy: To avoid spamming, we will check if a notification with this title was created today
        # by the system for ANY user. If so, we assume batch was done.
        # EXCEPT if force=True.
        
        if not force:
            exists = Notification.objects.filter(
                title=notification_title,
                created_at__date=today,
                notification_type='SYSTEM'
            ).exists()
            
            if exists:
                # self.stdout.write(f"Notifications for {meal_type} already sent today.")
                return

        # 1. Check Availability
        available_items = MenuItem.objects.filter(
            category=meal_type,
            is_available=True
        )

        if not available_items.exists():
            self.stdout.write(f"No available items for {meal_type}")
            return

        # 2. Construct Message
        items_list = "\n".join([f"- {item.name}: ${item.price}" for item in available_items])
        message = f"Our {meal_type.lower()} service is now open! Check out what's available:\n\n{items_list}\n\nOrder now through the app!"

        # 3. Get Recipients (All active guests)
        guests = User.objects.filter(role='GUEST', is_active=True)
        # Also include staff/admin for testing if no guests
        if not guests.exists():
             guests = User.objects.filter(is_active=True)

        self.stdout.write(f"Found {guests.count()} recipients for {meal_type} notification.")

        # 4. Send Emails & Create Notifications
        for guest in guests:
            # Create in-app notification
            # Avoid dupes per user
            if not Notification.objects.filter(
                user=guest,
                title=notification_title,
                created_at__date=today
            ).exists() or force:
                
                Notification.objects.create(
                    user=guest,
                    title=notification_title,
                    message=message,
                    notification_type='SYSTEM'
                )
                
                # Send Email
                try:
                    send_mail(
                        subject=f"SmartStay - {notification_title}",
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[guest.email],
                        fail_silently=True,
                    )
                    self.stdout.write(f"Sent email to {guest.email}")
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Failed to send email to {guest.email}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully processed {meal_type} notifications."))
