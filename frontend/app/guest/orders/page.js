'use client';
import { useState, useEffect } from 'react';
import { foodAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import '../guest.css';

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await foodAPI.getMyOrders();
            setOrders(Array.isArray(data) ? data : (data.results || []));
        } catch (err) { console.error('Failed to load orders:', err); }
        finally { setLoading(false); }
    };

    const getStatusColor = (status) => {
        const colors = { 'PENDING': '#f6ad55', 'PREPARING': '#4299e1', 'READY': '#48bb78', 'DELIVERED': '#718096', 'CANCELLED': '#f56565' };
        return colors[status] || '#a0aec0';
    };

    return (
        <div className="orders-page">
            <div className="page-header"><h1 className="page-title">{t('my_orders_title')}</h1></div>

            <div className="orders-list">
                {loading ? (<div className="loading">{t('loading_orders')}</div>) : orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="order-card card">
                            <div className="order-header">
                                <div className="order-info">
                                    <h3 className="order-number">{t('order')} #{order.id}</h3>
                                    <p className="order-date">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>{order.status}</div>
                            </div>
                            <div className="order-items">
                                {order.items.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <span className="item-qty">{item.quantity}x</span>
                                        <span className="item-name">{item.menu_item_name}</span>
                                        <span className="item-price">ETB {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <div className="room-info">
                                    <span className="label">{t('room')}:</span>
                                    <span className="value">{order.room_number || 'N/A'}</span>
                                </div>
                                <div className="total-info">
                                    <span className="label">{t('total_paid')}:</span>
                                    <span className="value total-price">ETB {order.total_price}</span>
                                </div>
                            </div>
                            {order.special_instructions && (
                                <div className="special-instructions">
                                    <span className="label">{t('note')}:</span>
                                    <p>{order.special_instructions}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-orders card">
                        <p>{t('no_orders')}</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/guest/food'} style={{ marginTop: '15px' }}>
                            {t('order_food_now')}
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .orders-list { display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 800px; margin: 0 auto; }
                .order-card { padding: 25px; }
                .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px; }
                .order-number { margin: 0; font-size: 1.2rem; }
                .order-date { margin: 5px 0 0 0; color: #a0aec0; font-size: 0.85rem; }
                .status-badge { padding: 6px 14px; border-radius: 999px; color: white; font-size: 0.75rem; font-weight: 700; }
                .order-items { margin-bottom: 20px; }
                .order-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #edf2f7; }
                .item-qty { color: #667eea; font-weight: bold; width: 30px; }
                .item-name { flex: 1; color: #4a5568; }
                .item-price { font-weight: 500; }
                .order-footer { display: flex; justify-content: space-between; background: #f7fafc; padding: 15px; border-radius: 8px; }
                .label { font-size: 0.75rem; color: #718096; text-transform: uppercase; margin-right: 8px; }
                .value { font-weight: 600; }
                .total-price { color: #667eea; font-size: 1.1rem; }
                .special-instructions { margin-top: 15px; font-size: 0.9rem; color: #718096; background: #fffaf0; padding: 10px; border-radius: 6px; }
                .no-orders { text-align: center; padding: 50px; }
            `}</style>
        </div>
    );
}
