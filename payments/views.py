from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Payment, Invoice
from .serializers import PaymentSerializer, InvoiceSerializer
from django.http import HttpResponse
import io
import requests
import json
import uuid
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False

class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        payment = serializer.save(user=self.request.user, status='COMPLETED')
        # Auto-generate invoice
        Invoice.objects.create(payment=payment)

class MyPaymentsView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

class InvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(payment__user=self.request.user)

class GenerateInvoicePDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, invoice_id):
        if not HAS_REPORTLAB:
            return Response({'error': 'PDF generation not available. Install reportlab package.'}, 
                          status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        try:
            invoice = Invoice.objects.get(id=invoice_id, payment__user=request.user)
            payment = invoice.payment
            
            # Create PDF
            buffer = io.BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            
            # Header
            p.setFont("Helvetica-Bold", 24)
            p.drawString(100, 750, "SmartStay Hotel")
            p.setFont("Helvetica", 12)
            p.drawString(100, 730, "Invoice")
            
            # Invoice Details
            p.setFont("Helvetica-Bold", 12)
            p.drawString(100, 700, f"Invoice Number: {invoice.invoice_number}")
            p.setFont("Helvetica", 10)
            p.drawString(100, 680, f"Date: {invoice.generated_at.strftime('%Y-%m-%d')}")
            p.drawString(100, 660, f"Transaction ID: {payment.transaction_id}")
            
            # Customer Details
            p.setFont("Helvetica-Bold", 12)
            p.drawString(100, 620, "Bill To:")
            p.setFont("Helvetica", 10)
            p.drawString(100, 600, f"{payment.user.username}")
            p.drawString(100, 580, f"{payment.user.email}")
            
            # Payment Details
            p.setFont("Helvetica-Bold", 12)
            p.drawString(100, 540, "Payment Details:")
            p.setFont("Helvetica", 10)
            p.drawString(100, 520, f"Description: {payment.description}")
            p.drawString(100, 500, f"Payment Method: {payment.get_payment_method_display()}")
            p.drawString(100, 480, f"Amount: ETB {payment.amount}")
            
            # Footer
            p.setFont("Helvetica-Bold", 14)
            p.drawString(100, 440, f"Total Amount: ETB {payment.amount}")
            p.setFont("Helvetica", 8)
            p.drawString(100, 100, "Thank you for choosing SmartStay Hotel!")
            
            p.showPage()
            p.save()
            
            buffer.seek(0)
            response = HttpResponse(buffer, content_type='application/pdf')
            filename = f"invoice_{invoice.invoice_number}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
            
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)

class InitializeChapaPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        amount = request.data.get('amount')
        description = request.data.get('description', 'Hotel Payment')
        payment_method = request.data.get('payment_method', 'CHAPA')
        
        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Chapa requires a unique transaction reference
        tx_ref = f"smartstay-{uuid.uuid4().hex[:10]}"
        
        # In a real app, these should be in settings.py / .env
        CHAPA_SECRET_KEY = getattr(settings, 'CHAPA_SECRET_KEY', 'CHAPA-Secondary-Key-Placeholder')
        
        try:
            # 1. Create a PENDING payment record first
            payment = Payment.objects.create(
                user=request.user,
                amount=amount,
                payment_method=payment_method,
                description=description,
                transaction_id=tx_ref,
                status='PENDING'
            )

            # 2. MOCK MODE: If key is placeholder, simulate success for testing
            if CHAPA_SECRET_KEY == 'CHAPA-Secondary-Key-Placeholder':
                payment.status = 'COMPLETED'
                payment.save()
                Invoice.objects.get_or_create(payment=payment)
                
                # Redirect to our new mock checkout page instead of instant success
                return Response({
                    'status': 'success',
                    'checkout_url': f"http://localhost:3001/guest/payments/checkout?amount={amount}&tx_ref={tx_ref}&description={description}",
                    'tx_ref': tx_ref,
                    'message': 'Mock Mode: Simulating Chapa Checkout Portal.'
                })

            # 3. REAL MODE: Call Chapa API
            chapa_url = "https://api.chapa.co/v1/transaction/initialize"
            payload = {
                "amount": str(amount),
                "currency": "ETB",
                "email": request.user.email,
                "first_name": request.user.username,
                "last_name": "Guest",
                "tx_ref": tx_ref,
                "callback_url": f"http://localhost:8000/api/payments/chapa-webhook/",
                "return_url": f"http://localhost:3001/guest/payments?status=success&tx_ref={tx_ref}",
                "customization": {
                    "title": "SmartStay Payment",
                    "description": description
                }
            }
            
            headers = {
                'Authorization': f'Bearer {CHAPA_SECRET_KEY}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(chapa_url, json=payload, headers=headers)
            res_data = response.json()
            
            if res_data.get('status') == 'success':
                checkout_url = res_data.get('data', {}).get('checkout_url')
                return Response({
                    'status': 'success',
                    'checkout_url': checkout_url,
                    'tx_ref': tx_ref
                })
            else:
                payment.delete() # Rollback if initialization fails
                return Response({
                    'status': 'error',
                    'message': res_data.get('message', 'Failed to initialize Chapa')
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class ChapaWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Chapa sends a JSON payload to this endpoint
        # In production, verify the hash/signature!
        data = request.data
        tx_ref = data.get('tx_ref')
        status_val = data.get('status')
        
        if tx_ref and status_val == 'success':
            try:
                payment = Payment.objects.get(transaction_id=tx_ref)
                if payment.status != 'COMPLETED':
                    payment.status = 'COMPLETED'
                    payment.save()
                    
                    # Auto-generate invoice
                    if not Invoice.objects.filter(payment=payment).exists():
                        Invoice.objects.create(payment=payment)
                        
                return Response({'status': 'received'}, status=status.HTTP_200_OK)
            except Payment.DoesNotExist:
                return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
                
        return Response({'status': 'ignored'}, status=status.HTTP_200_OK)
