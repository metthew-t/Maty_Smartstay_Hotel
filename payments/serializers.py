from rest_framework import serializers
from .models import Payment, Invoice

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['user', 'transaction_id', 'payment_date', 'status']

class InvoiceSerializer(serializers.ModelSerializer):
    payment_details = PaymentSerializer(source='payment', read_only=True)
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'generated_at', 'pdf_file', 'payment_details']
