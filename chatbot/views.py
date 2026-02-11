import google.generativeai as genai
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from decouple import config
from .models import ChatSession, ChatMessage
from .serializers import ChatMessageSerializer

# Note: Gemini is configured inside the view to ensure fresh settings

class StayMateAIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        message = request.data.get('message', '').strip()
        if not message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create chat session
        session, created = ChatSession.objects.get_or_create(
            user=request.user,
            ended_at=None
        )
        
        # Determine if we should use Gemini or fallback
        gemini_key = config('GEMINI_API_KEY', default='')
        if gemini_key and gemini_key != 'your_gemini_api_key_here':
            response = self.generate_gemini_response(message, session, gemini_key)
        else:
            response = "I'm currently in 'offline mode' because my AI brain (Gemini API Key) is not configured yet. Please ask the administrator to add the API key to the .env file. In the meantime, I can tell you that SmartStay offers luxury rooms, delicious food, and premium services!"
        
        # Save message
        chat_message = ChatMessage.objects.create(
            session=session,
            user=request.user,
            message=message,
            response=response
        )
        
        return Response({
            'message': message,
            'response': response,
            'timestamp': chat_message.timestamp
        })

    def generate_gemini_response(self, message, session, api_key):
        try:
            # Configure on every request to be safe with dynamic keys
            genai.configure(api_key=api_key)
            
            # System context for StayMate AI
            system_instruction = """
            You are StayMate AI, the official virtual assistant for SmartStay Hotel. 
            Your goal is to be helpful, professional, and welcoming. 
            
            HOTEL INFORMATION:
            - Rooms: We have Deluxe Suites (starting at 25,000 ETB), Standard, Premium, Luxury, and VIP Suites.
            - Amenities: Free WiFi, Swimming Pool, Fitness Center, Spa, Smart TV, Air Conditioning.
            - Services: Housekeeping, Spa Treatments, Airport Shuttle, Laundry.
            - Dining: Our restaurant offers Breakfast, Lunch, Dinner, Desserts, and Beverages. 
              Featured items include Avocado Toast and Grilled Salmon.
            - Policies: Check-in is at 2:00 PM, Check-out is at 12:00 PM.
            
            GUIDELINES:
            - If the guest asks about a specific room or service, encourage them to visit the corresponding section in the app.
            - Be concise but friendly.
            - You can respond in multiple languages (English, Amharic, Oromo, Spanish, French, Arabic, Urdu, Chinese).
            - If you don't know the answer, politely ask the guest to contact the front desk.
            """
            
            model = genai.GenerativeModel(
                model_name="gemini-flash-lite-latest",
                system_instruction=system_instruction
            )
            
            # Get chat history for context (last 5 messages)
            history = ChatMessage.objects.filter(session=session).order_by('-timestamp')[:5]
            chat_history = []
            for msg in reversed(history):
                chat_history.append({"role": "user", "parts": [msg.message]})
                chat_history.append({"role": "model", "parts": [msg.response]})
            
            chat = model.start_chat(history=chat_history)
            response = chat.send_message(message)
            return response.text
            
        except Exception as e:
            return f"I encountered a slight technical glitch (AI Error: {str(e)}). How else can I assist you with your stay at SmartStay?"

class ChatHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        session = ChatSession.objects.filter(user=request.user, ended_at=None).first()
        if session:
            messages = ChatMessage.objects.filter(session=session).order_by('timestamp')
            serializer = ChatMessageSerializer(messages, many=True)
            return Response(serializer.data)
        return Response([])

