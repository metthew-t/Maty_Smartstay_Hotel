from django.urls import path
from .views import (
    PaymentCreateView, MyPaymentsView, InvoiceListView, 
    GenerateInvoicePDFView, InitializeChapaPaymentView, ChapaWebhookView
)

urlpatterns = [
    path('create/', PaymentCreateView.as_view(), name='payment-create'),
    path('my-payments/', MyPaymentsView.as_view(), name='my-payments'),
    path('invoices/', InvoiceListView.as_view(), name='invoice-list'),
    path('invoice/<int:invoice_id>/pdf/', GenerateInvoicePDFView.as_view(), name='invoice-pdf'),
    path('initialize-chapa/', InitializeChapaPaymentView.as_view(), name='initialize-chapa'),
    path('chapa-webhook/', ChapaWebhookView.as_view(), name='chapa-webhook'),
]
