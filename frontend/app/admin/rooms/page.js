'use client';
import { useState, useEffect } from 'react';

export default function RoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/hotel/rooms/');
                if (res.ok) {
                    const data = await res.json();
                    setRooms(data);
                } else {
                    // Mock
                    setRooms([
                        { id: 1, number: '101', category: { name: 'Deluxe' }, status: 'AVAILABLE', base_price: '150.00' },
                        { id: 2, number: '102', category: { name: 'Standard' }, status: 'OCCUPIED', base_price: '100.00' },
                        { id: 3, number: '201', category: { name: 'Suite' }, status: 'MAINTENANCE', base_price: '300.00' }
                    ]);
                }
            } catch (error) {
                // Mock
                setRooms([
                    { id: 1, number: '101', category: { name: 'Deluxe' }, status: 'AVAILABLE', base_price: '150.00' },
                    { id: 2, number: '102', category: { name: 'Standard' }, status: 'OCCUPIED', base_price: '100.00' },
                    { id: 3, number: '201', category: { name: 'Suite' }, status: 'MAINTENANCE', base_price: '300.00' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Room Management</h1>
                <button className="btn btn-primary">Add Comp./Room</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Category</th>
                            <th>Price / Night</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Loading...</td></tr>
                        ) : rooms.map((room) => (
                            <tr key={room.id}>
                                <td>{room.number}</td>
                                <td>{room.category?.name || 'Uncategorized'}</td>
                                <td>ETB {room.base_price || room.price || '0'}</td>
                                <td>
                                    <span className={`status-badge status-${room.status.toLowerCase()}`}>
                                        {room.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
