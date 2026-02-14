'use client';
import { useState, useEffect } from 'react';
import { foodAPI } from '@/lib/api';

export default function StaffMenuPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'BREAKFAST',
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        is_dairy_free: false,
        is_nut_free: false,
        is_available: true,
    });

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            setLoading(true);
            const data = await foodAPI.staffGetMenu();
            setMenuItems(data);
        } catch (err) {
            console.error('Failed to load menu:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (item) => {
        try {
            await foodAPI.staffUpdateMenuItem(item.id, { is_available: !item.is_available });
            loadMenu();
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: 'BREAKFAST',
            is_vegetarian: false,
            is_vegan: false,
            is_gluten_free: false,
            is_dairy_free: false,
            is_nut_free: false,
            is_available: true,
        });
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            is_vegetarian: item.is_vegetarian,
            is_vegan: item.is_vegan,
            is_gluten_free: item.is_gluten_free,
            is_dairy_free: item.is_dairy_free,
            is_nut_free: item.is_nut_free,
            is_available: item.is_available,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await foodAPI.staffUpdateMenuItem(editingItem.id, formData);
            } else {
                await foodAPI.staffCreateMenuItem(formData);
            }
            setShowModal(false);
            loadMenu();
        } catch (err) {
            console.error('Save failed:', err);
            alert('Failed to save menu item. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this menu item?')) {
            try {
                await foodAPI.staffDeleteMenuItem(id);
                loadMenu();
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete item.');
            }
        }
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Menu Management</h1>
                <button className="btn btn-primary" onClick={openAddModal}>+ Add New Item</button>
            </div>
            {loading ? <div className="loading">Loading...</div> : (
                <div className="card">
                    <table className="table-compact">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Dietary</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map(item => (
                                <tr key={item.id}>
                                    <td><strong>{item.name}</strong></td>
                                    <td>{item.category}</td>
                                    <td>ETB {item.price}</td>
                                    <td>{item.dietary_tags.join(', ')}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleAvailability(item)}
                                            style={{
                                                background: item.is_available ? '#d4edda' : '#f8d7da',
                                                color: item.is_available ? '#155724' : '#721c24',
                                                border: 'none', padding: '4px 12px', borderRadius: '12px', cursor: 'pointer'
                                            }}
                                        >
                                            {item.is_available ? 'In Stock' : 'Out of Stock'}
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm" onClick={() => openEditModal(item)} style={{ marginRight: '8px' }}>Edit</button>
                                        <button className="btn btn-sm" onClick={() => handleDelete(item.id)} style={{ background: '#dc3545', color: 'white' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: 'white', padding: '30px', borderRadius: '12px',
                        width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description *</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price (ETB) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    >
                                        <option value="BREAKFAST">Breakfast</option>
                                        <option value="LUNCH">Lunch</option>
                                        <option value="DINNER">Dinner</option>
                                        <option value="DESSERT">Dessert</option>
                                        <option value="BEVERAGES">Beverages</option>
                                        <option value="SNACKS">Snacks</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Dietary Tags</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {[
                                        { key: 'is_vegetarian', label: 'Vegetarian' },
                                        { key: 'is_vegan', label: 'Vegan' },
                                        { key: 'is_gluten_free', label: 'Gluten-Free' },
                                        { key: 'is_dairy_free', label: 'Dairy-Free' },
                                        { key: 'is_nut_free', label: 'Nut-Free' },
                                        { key: 'is_available', label: 'Available' },
                                    ].map(({ key, label }) => (
                                        <label key={key} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData[key]}
                                                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                                                style={{ marginRight: '8px' }}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ padding: '10px 20px' }}
                                >
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
