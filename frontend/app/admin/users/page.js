'use client';
import { useState, useEffect } from 'react';
import { userAPI } from '@/lib/api';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userAPI.list();
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await userAPI.delete(userId);
            setUsers(users.filter(u => u.id !== userId));
            alert('User deleted successfully');
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert('Failed to delete user');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">User Management</h1>
                <button className="btn btn-primary">Add New User</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>
                                        <span className="status-badge" style={{
                                            background: user.role === 'ADMIN' ? '#e2e8f0' : '#f7fafc',
                                            color: user.role === 'ADMIN' ? '#2d3748' : '#718096'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-primary" style={{ marginRight: '10px' }}>Edit</button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

