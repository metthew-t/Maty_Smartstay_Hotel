'use client';
import { useState, useEffect } from 'react';

export default function StaffDashboard() {
    const [stats, setStats] = useState({
        pendingRequests: 5,
        activeOrders: 8,
        occupiedRooms: 12,
        maintenanceRooms: 2
    });

    return (
        <div>
            <div className="page-header">
                <h1>Overview</h1>
            </div>

            <div className="dashboard-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div className="card">
                    <div style={{ color: '#7f8c8d' }}>Pending Requests</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.pendingRequests}</div>
                </div>
                <div className="card">
                    <div style={{ color: '#7f8c8d' }}>Active Food Orders</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.activeOrders}</div>
                </div>
                <div className="card">
                    <div style={{ color: '#7f8c8d' }}>Occupied Rooms</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.occupiedRooms}</div>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #e74c3c' }}>
                    <div style={{ color: '#7f8c8d' }}>Maintenance</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.maintenanceRooms}</div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h3>Recent Activity Log</h3>
                <div className="activity-list">
                    <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>🛎️ Housekeeping requested for Room 101</div>
                    <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>🍔 Burger Order #452 marked as READY</div>
                    <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>🛏️ Room 205 changed to CLEANING</div>
                </div>
            </div>
        </div>
    );
}
