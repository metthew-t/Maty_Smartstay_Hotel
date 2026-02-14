'use client';
import { useState, useEffect } from 'react';

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Similar fetch logic
        const fetchBookings = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                setBookings([
                    { id: 1001, guest: 'john.doe@example.com', room: '101', check_in: '2024-06-01', check_out: '2024-06-05', status: 'CONFIRMED' },
                    { id: 1002, guest: 'jane.smith@example.com', room: '205', check_in: '2024-06-10', check_out: '2024-06-12', status: 'PENDING' }
                ]);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('http://localhost:8000/api/hotel/bookings/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);
                }
            } catch (e) {
                setBookings([
                    { id: 1001, guest: 'john.doe@example.com', room: '101', check_in: '2024-06-01', check_out: '2024-06-05', status: 'CONFIRMED' },
                    { id: 1002, guest: 'jane.smith@example.com', room: '205', check_in: '2024-06-10', check_out: '2024-06-12', status: 'PENDING' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Bookings</h1>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Guest</th>
                            <th>Room</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7">Loading...</td></tr>
                        ) : bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.guest}</td>
                                <td>{booking.room}</td>
                                <td>{booking.check_in}</td>
                                <td>{booking.check_out}</td>
                                <td>
                                    <span className="status-badge" style={{ background: '#edf2f7', color: '#2d3748' }}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
