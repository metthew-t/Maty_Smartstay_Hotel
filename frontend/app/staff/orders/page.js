'use client';
import { useState, useEffect } from 'react';
import { foodAPI } from '@/lib/api';

export default function StaffOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await foodAPI.staffGetOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await foodAPI.staffUpdateStatus(id, status);
            loadOrders();
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div>
            <h1>Kitchen Orders</h1>
            {loading ? <div className="loading">Loading...</div> : (
                <div className="card">
                    <table className="table-compact">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Room</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.room_number || 'Room TBD'}</td>
                                    <td>{order.items.map(item => `${item.quantity}x ${item.menu_item_name}`).join(', ')}</td>
                                    <td>ETB {order.total_price}</td>
                                    <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => updateStatus(order.id, 'PREPARING')}
                                                style={{ background: '#3498db', color: 'white' }}
                                            >Prepare</button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => updateStatus(order.id, 'READY')}
                                                style={{ background: '#2ecc71', color: 'white' }}
                                            >Ready</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
