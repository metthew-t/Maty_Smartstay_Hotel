'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../guest.css'; // Reusing guest styles

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Client-side token retrieval
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('access_token');
            if (!storedToken) {
                router.push('/register'); // Redirect if no token
                return;
            }
            setToken(storedToken);
        }
    }, [router]);

    useEffect(() => {
        if (token) {
            fetchNotifications(token);
        }
    }, [token]);

    const fetchNotifications = async (authToken) => {
        try {
            const res = await fetch('http://localhost:8000/api/notifications/', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        if (!token) return;
        try {
            await fetch(`http://localhost:8000/api/notifications/${id}/read/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'BOOKING': return '✅';
            case 'SERVICE': return '🛎️';
            case 'SYSTEM': return 'ℹ️';
            case 'PAYMENT': return '💳';
            default: return '🔔';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading notifications...</div>;

    return (
        <div className="dashboard-content">
            <div className="section-header" style={{ marginBottom: '20px' }}>
                <h2>Notifications</h2>
                <p style={{ color: '#666' }}>Stay updated with your latest activities.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {notifications.length === 0 ? (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        background: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #eee',
                        color: '#888'
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔔</div>
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '15px',
                                padding: '20px',
                                background: '#fff',
                                borderRadius: '8px',
                                borderLeft: notification.is_read ? '4px solid transparent' : '4px solid #3b82f6',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s'
                            }}
                        >
                            <div style={{ fontSize: '24px' }}>
                                {getIcon(notification.notification_type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: notification.is_read ? 'normal' : 'bold',
                                        color: '#333',
                                        margin: 0
                                    }}>
                                        {notification.title}
                                    </h3>
                                    <span style={{ fontSize: '12px', color: '#999' }}>
                                        {formatDate(notification.created_at)}
                                    </span>
                                </div>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#555',
                                    margin: '5px 0 10px 0',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {notification.message}
                                </p>

                                {!notification.is_read && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#3b82f6',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
