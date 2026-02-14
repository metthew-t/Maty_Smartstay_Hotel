'use client';
import { useState, useEffect } from 'react';
import { bookingAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import '../guest.css';

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => { loadBookings(); }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingAPI.getMyBookings();
            setBookings(Array.isArray(data) ? data : (data.results || []));
        } catch (err) { console.error('Failed to load bookings:', err); }
        finally { setLoading(false); }
    };

    const getStatusColor = (status) => {
        const colors = { 'PENDING': '#f6ad55', 'CONFIRMED': '#48bb78', 'CHECKED_IN': '#4299e1', 'CHECKED_OUT': '#718096', 'CANCELLED': '#f56565' };
        return colors[status] || '#a0aec0';
    };

    return (
        <div className="bookings-page">
            <div className="page-header"><h1 className="page-title">{t('my_bookings_title')}</h1></div>

            <div className="bookings-list">
                {loading ? (<div className="loading">{t('loading_bookings')}</div>) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} className="booking-card card">
                            <div className="booking-header">
                                <div className="booking-room">
                                    <span className="room-icon">🛏️</span>
                                    <div>
                                        <h3 className="room-number">{t('room')} {booking.room_number}</h3>
                                        <p className="room-category">{booking.room_category}</p>
                                    </div>
                                </div>
                                <div className="status-badge" style={{ backgroundColor: getStatusColor(booking.status) }}>{booking.status}</div>
                            </div>
                            <div className="booking-details">
                                <div className="detail-item">
                                    <span className="label">{t('check_in')}</span>
                                    <span className="value">{new Date(booking.check_in).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">{t('check_out')}</span>
                                    <span className="value">{new Date(booking.check_out).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">{t('guests')}</span>
                                    <span className="value">{booking.number_of_guests}</span>
                                </div>
                                <div className="detail-item price-item">
                                    <span className="label">{t('total_price')}</span>
                                    <span className="value price">ETB {booking.total_price}</span>
                                </div>
                            </div>
                            {booking.status === 'PENDING' && (
                                <div className="booking-actions">
                                    <button className="btn btn-outline" style={{ color: '#f56565', borderColor: '#f56565' }}>
                                        {t('cancel_booking')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-bookings card">
                        <p>{t('no_bookings')}</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/guest/booking'} style={{ marginTop: '15px' }}>
                            {t('book_room_now')}
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .bookings-list { display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 800px; margin: 0 auto; }
                .booking-card { padding: 25px; }
                .booking-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px; }
                .booking-room { display: flex; gap: 15px; align-items: center; }
                .room-icon { font-size: 2.5rem; background: #f7fafc; padding: 10px; border-radius: 12px; }
                .room-number { margin: 0; font-size: 1.25rem; }
                .room-category { margin: 2px 0 0 0; color: #718096; font-size: 0.9rem; }
                .status-badge { padding: 6px 14px; border-radius: 999px; color: white; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; }
                .booking-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; }
                .detail-item { display: flex; flex-direction: column; }
                .label { font-size: 0.75rem; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
                .value { font-weight: 600; color: #2d3748; }
                .price { color: #667eea; font-size: 1.2rem; }
                .no-bookings { text-align: center; padding: 50px; color: #718096; }
                .booking-actions { margin-top: 20px; padding-top: 20px; border-top: 1px solid #edf2f7; display: flex; justify-content: flex-end; }
            `}</style>
        </div>
    );
}
