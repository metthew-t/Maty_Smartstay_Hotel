'use client';
import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_bookings: 0,
        revenue: 0,
        recent_signups: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await analyticsAPI.getDashboard();
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard Overview</h1>
                <button className="btn btn-primary" onClick={fetchAnalytics}>Refresh Data</button>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{stats.total_users}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Bookings</div>
                    <div className="stat-value">{stats.total_bookings}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">ETB {Number(stats.revenue).toLocaleString()}</div>
                </div>
            </div>

            <div className="page-header">
                <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Recent Signups</h2>
            </div>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Date Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recent_signups && stats.recent_signups.length > 0 ? (
                            stats.recent_signups.map((user) => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No recent signups</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

