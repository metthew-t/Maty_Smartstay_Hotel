from django.urls import path
from .views import StayMateAIView, ChatHistoryView

urlpatterns = [
    path('chat/', StayMateAIView.as_view(), name='staymate-chat'),
    path('history/', ChatHistoryView.as_view(), name='chat-history'),
]
