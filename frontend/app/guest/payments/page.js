'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentAPI, bookingAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function PaymentsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        description: 'Room Booking',
        payment_method: 'CREDIT_CARD'
    });
    const { t } = useLanguage();

    useEffect(() => {
        loadData();
        // Check for booking details in URL params
        const amount = searchParams.get('price') || searchParams.get('amount');
        const roomNumber = searchParams.get('room_number');
        const type = searchParams.get('type');
        const itemsSummary = searchParams.get('items_summary');

        if (amount) {
            let description = 'Payment';
            if (type === 'food') {
                description = `Food Order - ${itemsSummary || 'Room ' + roomNumber}`;
            } else if (roomNumber) {
                description = `Room Booking - Room ${roomNumber}`;
            }

            setPaymentForm(prev => ({
                ...prev,
                amount: amount,
                description: description
            }));
        }
    }, [searchParams]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [paymentsList, invoicesList] = await Promise.all([paymentAPI.getMyPayments(), paymentAPI.getInvoices()]);
            setPayments(paymentsList);
            setInvoices(invoicesList);
        } catch (err) { console.error('Failed to load payment data:', err); }
        finally { setLoading(false); }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        const amount = parseFloat(paymentForm.amount);
        if (!amount || amount <= 0) { alert(t('valid_amount')); return; }

        try {
            setLoading(true);

            // Special handling for Chapa-supported methods (CBE, Awash, TeleBirr)
            const chapaMethods = ['CBE', 'AWASH_BANK', 'TELEBIRR'];
            if (chapaMethods.includes(paymentForm.payment_method)) {
                const response = await paymentAPI.initializeChapa({
                    amount: amount,
                    description: paymentForm.description,
                    payment_method: paymentForm.payment_method
                });

                if (response.status === 'success' && response.checkout_url) {
                    // Redirect to Chapa secure checkout
                    window.location.href = response.checkout_url;
                    return;
                }
            }

            // Legacy path for non-automated payments
            const type = searchParams.get('type');
            let bookingId = null;

            if (type === 'food') {
                const itemsStr = searchParams.get('items');
                const roomNumber = searchParams.get('room_number');
                const instructions = searchParams.get('instructions');

                if (itemsStr) {
                    const items = JSON.parse(itemsStr);
                    await foodAPI.createOrder({
                        items: items,
                        room_number: roomNumber || '',
                        special_instructions: instructions || ''
                    });
                }
            } else {
                // Handle Room Booking
                const roomId = searchParams.get('room_id');
                const checkIn = searchParams.get('check_in');
                const checkOut = searchParams.get('check_out');
                const guests = searchParams.get('guests');

                if (roomId && checkIn && checkOut) {
                    const bookingResponse = await bookingAPI.createBooking({
                        room: parseInt(roomId),
                        check_in: checkIn,
                        check_out: checkOut,
                        number_of_guests: parseInt(guests) || 1,
                        total_price: amount
                    });
                    bookingId = bookingResponse.id;
                }
            }

            await paymentAPI.create({
                amount: amount,
                description: paymentForm.description,
                payment_method: paymentForm.payment_method,
                booking: bookingId
            });

            alert(t('payment_success'));
            setPaymentForm({ ...paymentForm, amount: '' });
            loadData();
        } catch (err) {
            console.error('Payment processing failed:', err);
            alert(t('payment_failed'));
        } finally {
            setLoading(false);
        }
    };

    // Check for success redirect from Chapa
    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'success') {
            alert(t('payment_success'));
            // Optionally clean up URL
            router.replace('/guest/payments');
            loadData();
        }
    }, [searchParams]);

    const handleDownloadInvoice = async (invoiceId) => {
        try {
            const response = await paymentAPI.downloadInvoice(invoiceId);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `invoice_${invoiceId}.pdf`;
                document.body.appendChild(a); a.click(); a.remove();
            } else { alert('PDF generation not available.'); }
        } catch (err) { console.error('Download failed:', err); alert('Failed to download invoice.'); }
    };

    return (
        <div className="payments-page">
            <div className="page-header"><h1 className="page-title">{t('payments_title')}</h1></div>

            <div className="payments-grid">
                <div className="payment-form-section">
                    <div className="card">
                        <h2 style={{ marginTop: 0 }}>{t('make_payment')}</h2>
                        <form onSubmit={handlePayment} className="payment-form">
                            <div className="form-group">
                                <label>{t('description_label')}</label>
                                <select className="form-input" value={paymentForm.description} onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}>
                                    <option value="Room Booking">{t('room_booking')}</option>
                                    <option value="Food Order">{t('food_order')}</option>
                                    <option value="Spa Service">{t('spa_service')}</option>
                                    <option value="Other">{t('other')}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{t('amount')}</label>
                                <input type="number" className="form-input" placeholder="0.00" value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{t('payment_method')}</label>
                                <select className="form-input" value={paymentForm.payment_method} onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}>
                                    <option value="CREDIT_CARD">{t('credit_card')}</option>
                                    <option value="DEBIT_CARD">{t('debit_card')}</option>
                                    <option value="BANK_TRANSFER">{t('bank_transfer')}</option>
                                    <option value="CBE">{t('payment_cbe')}</option>
                                    <option value="AWASH_BANK">{t('payment_awash')}</option>
                                    <option value="TELEBIRR">{t('payment_telebirr')}</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>{t('pay_now')}</button>
                        </form>
                    </div>
                </div>

                <div className="history-section">
                    <div className="card">
                        <h2 style={{ marginTop: 0 }}>{t('payment_history')}</h2>
                        {loading ? (<div className="loading">{t('loading')}</div>) : payments.length > 0 ? (
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead><tr><th>{t('date')}</th><th>{t('description_label')}</th><th>{t('amount')}</th><th>{t('status')}</th></tr></thead>
                                    <tbody>
                                        {payments.map(p => (
                                            <tr key={p.id}>
                                                <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                                                <td>{p.description}</td>
                                                <td style={{ fontWeight: 'bold' }}>ETB {p.amount}</td>
                                                <td><span className={`status-badge status-${p.status.toLowerCase()}`}>{p.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (<div className="no-data">{t('no_payments')}</div>)}
                    </div>

                    <div className="card" style={{ marginTop: '30px' }}>
                        <h2 style={{ marginTop: 0 }}>{t('invoices')}</h2>
                        {loading ? (<div className="loading">{t('loading')}</div>) : invoices.length > 0 ? (
                            <div className="invoices-list">
                                {invoices.map(inv => (
                                    <div key={inv.id} className="invoice-item">
                                        <div className="invoice-info">
                                            <div className="invoice-num">{inv.invoice_number}</div>
                                            <div className="invoice-date">{t('generated')}: {new Date(inv.generated_at).toLocaleDateString()}</div>
                                        </div>
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleDownloadInvoice(inv.id)}>{t('download_pdf')}</button>
                                    </div>
                                ))}
                            </div>
                        ) : (<div className="no-data">{t('no_invoices')}</div>)}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .payments-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; }
                .payment-form .form-input { 
                    color: #1a1a2e !important; 
                    background-color: #ffffff !important; 
                    border: 1px solid #cbd5e0 !important;
                    font-weight: 500;
                }
                /* Specific fix for select elements to ensure dark text on forced white background */
                .payment-form select.form-input {
                    color: #1a1a2e !important;
                    background-color: #ffffff !important;
                }
                .invoice-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #edf2f7; border-radius: 12px; margin-bottom: 10px; }
                .invoice-num { font-weight: bold; color: #2d3748; }
                .invoice-date { font-size: 0.8rem; color: #718096; }
                .status-completed { background: #d4edda; color: #155724; }
                .status-pending { background: #fff3cd; color: #856404; }
                .status-failed { background: #f8d7da; color: #721c24; }
            `}</style>
        </div>
    );
}
