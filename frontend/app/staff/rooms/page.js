'use client';
import { useState, useEffect } from 'react';
import { bookingAPI } from '@/lib/api';
import '../staff.css';

export default function StaffRoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({});
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        loadRooms();
        loadCategories();
    }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const data = await bookingAPI.staffMonitorRooms();
            setRooms(data);
        } catch (err) {
            console.error('Failed to load rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await bookingAPI.getCategories();
            // Ensure data is an array before setting
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load categories:', err);
            setCategories([]); // Ensure it stays as an empty array on error
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setActiveTab('info');
        setFormData({
            status: room.status || 'AVAILABLE',
            capacity: room.capacity || 2,
            area: room.area || 30,
            is_active: room.is_active !== false,
            category_id: room.category?.id || '',
            // Detailed room info
            description: room.description || '',
            temperature_setting: room.temperature_setting || '18-24°C',
            window_type: room.window_type || 'CITY_VIEW',
            room_quality: room.room_quality || 'STANDARD',
            // Amenities
            has_nightwear: room.has_nightwear || false,
            has_toiletries: room.has_toiletries !== false,
            has_minibar: room.has_minibar || false,
            has_safe: room.has_safe !== false,
            has_wifi: room.has_wifi !== false,
            has_tv: room.has_tv !== false,
            has_air_conditioning: room.has_air_conditioning !== false,
            has_balcony: room.has_balcony || false,
            // Additional
            bed_type: room.bed_type || 'Queen Size',
            bathroom_type: room.bathroom_type || 'Private',
            special_features: room.special_features || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await bookingAPI.updateRoom(editingRoom.id, formData);
            setEditingRoom(null);
            loadRooms();
            alert('Room updated successfully!');
        } catch (err) {
            alert('Failed to update room: ' + err.message);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const mediaType = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
        const uploadData = new FormData();
        uploadData.append('room', editingRoom.id);
        uploadData.append('file', file);
        uploadData.append('media_type', mediaType);

        try {
            setUploading(true);
            await bookingAPI.uploadMedia(uploadData);
            const updatedRooms = await bookingAPI.staffMonitorRooms();
            setRooms(updatedRooms);
            const currentRoom = updatedRooms.find(r => r.id === editingRoom.id);
            setEditingRoom(currentRoom);
            alert('Media uploaded successfully!');
        } catch (err) {
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMedia = async (mediaId) => {
        if (!confirm('Are you sure you want to delete this media?')) return;
        try {
            await bookingAPI.deleteMedia(mediaId);
            const updatedRooms = await bookingAPI.staffMonitorRooms();
            setRooms(updatedRooms);
            const currentRoom = updatedRooms.find(r => r.id === editingRoom.id);
            setEditingRoom(currentRoom);
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return '#2ecc71';
            case 'OCCUPIED': return '#e74c3c';
            case 'MAINTENANCE': return '#f1c40f';
            case 'RESERVED': return '#3498db';
            default: return '#95a5a6';
        }
    };

    return (
        <div className="staff-rooms-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>🏨 Room Operations</h1>
                <div className="status-legend" style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#2ecc71', borderRadius: '50%' }}></span> Available</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#e74c3c', borderRadius: '50%' }}></span> Occupied</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#f1c40f', borderRadius: '50%' }}></span> Maintenance</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', background: '#3498db', borderRadius: '50%' }}></span> Reserved</span>
                </div>
            </div>

            {loading ? <div className="loading">Loading...</div> : (
                <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {rooms.map(room => (
                        <div key={room.id} className="card" style={{
                            padding: '0',
                            overflow: 'hidden',
                            borderTop: `5px solid ${getStatusColor(room.status)}`,
                        }}>
                            <div className="room-media-preview" style={{ height: '160px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }}>
                                {room.media && room.media.length > 0 ? (
                                    room.media[0].media_type === 'IMAGE' ? (
                                        <img src={room.media[0].file} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <video src={room.media[0].file} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                    )
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white' }}>
                                        <span style={{ fontSize: '40px' }}>🛏️</span>
                                        <span style={{ marginTop: '10px' }}>No Media</span>
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                    {room.media?.length || 0} media
                                </div>
                            </div>
                            <div style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ margin: '0', fontSize: '20px' }}>Room {room.number}</h2>
                                    <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Floor {room.floor}</span>
                                </div>
                                <p style={{ color: '#7f8c8d', margin: '5px 0', fontSize: '14px' }}>{room.category_name}</p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '10px 0' }}>
                                    <span style={{ fontSize: '11px', background: '#ecf0f1', padding: '3px 8px', borderRadius: '3px' }}>👥 {room.capacity} guests</span>
                                    <span style={{ fontSize: '11px', background: '#ecf0f1', padding: '3px 8px', borderRadius: '3px' }}>📐 {room.area}m²</span>
                                </div>
                                <div style={{
                                    background: getStatusColor(room.status),
                                    color: 'white',
                                    padding: '6px 0',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    margin: '10px 0'
                                }}>
                                    {room.status}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '10px' }}
                                    onClick={() => handleEdit(room)}
                                >
                                    ✏️ Edit Room & Media
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingRoom && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '800px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>✏️ Edit Room {editingRoom.number}</h2>
                            <button
                                onClick={() => setEditingRoom(null)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                            <button
                                onClick={() => setActiveTab('info')}
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    background: activeTab === 'info' ? '#3498db' : '#ecf0f1',
                                    color: activeTab === 'info' ? 'white' : '#333',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                📋 Room Info
                            </button>
                            <button
                                onClick={() => setActiveTab('amenities')}
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    background: activeTab === 'amenities' ? '#3498db' : '#ecf0f1',
                                    color: activeTab === 'amenities' ? 'white' : '#333',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                🛎️ Amenities
                            </button>
                            <button
                                onClick={() => setActiveTab('media')}
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    background: activeTab === 'media' ? '#3498db' : '#ecf0f1',
                                    color: activeTab === 'media' ? 'white' : '#333',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                📸 Photos & Videos
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Room Info Tab */}
                            {activeTab === 'info' && (
                                <div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="form-group">
                                            <label>🔄 Status</label>
                                            <select
                                                className="form-control"
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            >
                                                <option value="AVAILABLE">Available</option>
                                                <option value="OCCUPIED">Occupied</option>
                                                <option value="MAINTENANCE">Maintenance</option>
                                                <option value="RESERVED">Reserved</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>📁 Category</label>
                                            <select
                                                className="form-control"
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            >
                                                <option value="">Select Category</option>
                                                {Array.isArray(categories) && categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>👥 Capacity (guests)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.capacity}
                                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>📐 Area (m²)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                value={formData.area}
                                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>🌡️ Temperature Setting</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g., 18-24°C"
                                                value={formData.temperature_setting}
                                                onChange={(e) => setFormData({ ...formData, temperature_setting: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>⭐ Room Quality</label>
                                            <select
                                                className="form-control"
                                                value={formData.room_quality}
                                                onChange={(e) => setFormData({ ...formData, room_quality: e.target.value })}
                                            >
                                                <option value="STANDARD">Standard</option>
                                                <option value="PREMIUM">Premium</option>
                                                <option value="LUXURY">Luxury</option>
                                                <option value="VIP">VIP Suite</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>🪟 Window Type</label>
                                            <select
                                                className="form-control"
                                                value={formData.window_type}
                                                onChange={(e) => setFormData({ ...formData, window_type: e.target.value })}
                                            >
                                                <option value="OCEAN_VIEW">Ocean View</option>
                                                <option value="GARDEN_VIEW">Garden View</option>
                                                <option value="CITY_VIEW">City View</option>
                                                <option value="POOL_VIEW">Pool View</option>
                                                <option value="NO_WINDOW">No Window</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>🛏️ Bed Type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g., Queen Size, King Size"
                                                value={formData.bed_type}
                                                onChange={(e) => setFormData({ ...formData, bed_type: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>🚿 Bathroom Type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g., Private, Shared"
                                                value={formData.bathroom_type}
                                                onChange={(e) => setFormData({ ...formData, bathroom_type: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '15px' }}>
                                        <label>📝 Room Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describe this room..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>✨ Special Features</label>
                                        <textarea
                                            className="form-control"
                                            rows="2"
                                            placeholder="Any special features..."
                                            value={formData.special_features}
                                            onChange={(e) => setFormData({ ...formData, special_features: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {/* Amenities Tab */}
                            {activeTab === 'amenities' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    {[
                                        { key: 'has_nightwear', icon: '👘', label: 'Nightwear / Robes' },
                                        { key: 'has_toiletries', icon: '🧴', label: 'Toiletries' },
                                        { key: 'has_minibar', icon: '🍾', label: 'Minibar' },
                                        { key: 'has_safe', icon: '🔐', label: 'In-Room Safe' },
                                        { key: 'has_wifi', icon: '📶', label: 'Free WiFi' },
                                        { key: 'has_tv', icon: '📺', label: 'Smart TV' },
                                        { key: 'has_air_conditioning', icon: '❄️', label: 'Air Conditioning' },
                                        { key: 'has_balcony', icon: '🌅', label: 'Private Balcony' },
                                    ].map(amenity => (
                                        <div
                                            key={amenity.key}
                                            onClick={() => setFormData({ ...formData, [amenity.key]: !formData[amenity.key] })}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '15px',
                                                border: formData[amenity.key] ? '2px solid #2ecc71' : '2px solid #ddd',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                background: formData[amenity.key] ? '#e8f8f0' : 'white',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span style={{ fontSize: '24px' }}>{amenity.icon}</span>
                                            <span style={{ fontWeight: '600' }}>{amenity.label}</span>
                                            <span style={{ marginLeft: 'auto', color: formData[amenity.key] ? '#2ecc71' : '#ccc' }}>
                                                {formData[amenity.key] ? '✓' : '○'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Media Tab */}
                            {activeTab === 'media' && (
                                <div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '16px', marginBottom: '15px', display: 'block' }}>
                                            📤 Upload Photos & Videos
                                        </label>
                                        <div style={{
                                            border: '3px dashed #3498db',
                                            borderRadius: '12px',
                                            padding: '40px',
                                            textAlign: 'center',
                                            background: '#f8fafc',
                                            cursor: 'pointer'
                                        }}>
                                            <input
                                                type="file"
                                                id="mediaUpload"
                                                style={{ display: 'none' }}
                                                onChange={handleFileUpload}
                                                accept="image/*,video/*"
                                                disabled={uploading}
                                            />
                                            <label htmlFor="mediaUpload" style={{ cursor: 'pointer' }}>
                                                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📁</div>
                                                <p style={{ color: '#3498db', fontWeight: '600', fontSize: '16px' }}>
                                                    Click to browse files
                                                </p>
                                                <p style={{ color: '#7f8c8d', fontSize: '13px' }}>
                                                    Supports images (JPG, PNG, GIF) and videos (MP4, WebM)
                                                </p>
                                            </label>
                                        </div>
                                        {uploading && (
                                            <p style={{ textAlign: 'center', color: '#3498db', marginTop: '15px' }}>
                                                ⏳ Uploading... Please wait.
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-group" style={{ marginTop: '25px' }}>
                                        <label style={{ fontSize: '16px', marginBottom: '15px', display: 'block' }}>
                                            📸 Current Media ({editingRoom.media?.length || 0} files)
                                        </label>
                                        {editingRoom.media && editingRoom.media.length > 0 ? (
                                            <div className="media-preview-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                                                {editingRoom.media.map(m => (
                                                    <div key={m.id} className="media-item" style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                                        {m.media_type === 'IMAGE' ? (
                                                            <img src={m.file} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <video src={m.file} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        )}
                                                        <div style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>
                                                            {m.media_type}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteMedia(m.id)}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '5px',
                                                                right: '5px',
                                                                background: '#e74c3c',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '50%',
                                                                width: '28px',
                                                                height: '28px',
                                                                cursor: 'pointer',
                                                                fontSize: '16px'
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '8px' }}>
                                                <span style={{ fontSize: '40px' }}>📷</span>
                                                <p style={{ color: '#7f8c8d', marginTop: '10px' }}>No media uploaded yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                                    💾 Save Changes
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditingRoom(null)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
