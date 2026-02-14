'use client';
import { useState, useEffect } from 'react';
import { serviceAPI } from '@/lib/api';

export default function StaffRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await serviceAPI.staffGetRequests();
            setRequests(data);
        } catch (err) {
            console.error('Failed to load requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await serviceAPI.staffUpdateStatus(id, status);
            loadRequests();
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div>
            <h1>Guest Service Requests</h1>
            {loading ? <div className="loading">Loading...</div> : (
                <div className="card">
                    <table className="table-compact">
                        <thead>
                            <tr>
                                <th>Guest</th>
                                <th>Service</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id}>
                                    <td>{req.guest_name || 'Guest'}</td>
                                    <td>{req.service_name}</td>
                                    <td>{new Date(req.requested_datetime).toLocaleString()}</td>
                                    <td><span className={`status-badge status-${req.status.toLowerCase()}`}>{req.status}</span></td>
                                    <td>
                                        <select
                                            onChange={(e) => updateStatus(req.id, e.target.value)}
                                            defaultValue=""
                                            className="form-input"
                                            style={{ padding: '4px', width: 'auto' }}
                                        >
                                            <option value="" disabled>Update Status</option>
                                            <option value="IN_PROGRESS">Mark In Progress</option>
                                            <option value="COMPLETED">Mark Completed</option>
                                            <option value="CANCELLED">Cancel</option>
                                        </select>
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
