'use client';
import { useState, useEffect } from 'react';
import { bookingAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function BookingPage() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingData, setBookingData] = useState({ check_in: '', check_out: '', guests: 1 });
    const { t } = useLanguage();

    useEffect(() => { loadRooms(); }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const data = await bookingAPI.getRooms();
            setRooms(Array.isArray(data) ? data : (data.results || []));
        } catch (err) { console.error('Failed to load rooms:', err); }
        finally { setLoading(false); }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await bookingAPI.getAvailableRooms(bookingData.check_in, bookingData.check_out);
            setRooms(Array.isArray(data) ? data : (data.results || []));
        } catch (err) { console.error('Failed to search rooms:', err); }
        finally { setLoading(false); }
    };

    const handleBook = async (room) => {
        if (!bookingData.check_in || !bookingData.check_out) {
            alert(t('select_dates_alert'));
            return;
        }
        try {
            const params = new URLSearchParams({
                room_id: room.id,
                room_number: room.number,
                check_in: bookingData.check_in,
                check_out: bookingData.check_out,
                guests: bookingData.guests,
                price: room.price || 150
            });
            window.location.href = `/guest/payments?${params.toString()}`;
        } catch (err) {
            console.error('Failed to book room:', err);
            alert(t('booking_failed'));
        }
    };

    const getWindowTypeLabel = (type) => {
        const labels = { 'OCEAN_VIEW': '🌊 Ocean View', 'GARDEN_VIEW': '🌳 Garden View', 'CITY_VIEW': '🏙️ City View', 'POOL_VIEW': '🏊 Pool View', 'NO_WINDOW': '🚫 No Window' };
        return labels[type] || type;
    };

    const getQualityLabel = (quality) => {
        const labels = { 'STANDARD': 'Standard', 'PREMIUM': '⭐ Premium', 'LUXURY': '⭐⭐ Luxury', 'VIP': '👑 VIP Suite' };
        return labels[quality] || quality;
    };

    return (
        <div className="booking-page">
            <div className="page-header"><h1 className="page-title">{t('booking_title')}</h1></div>

            <div className="card search-card">
                <form onSubmit={handleSearch} className="booking-search-form">
                    <div className="form-group">
                        <label>{t('check_in')}</label>
                        <input type="date" className="form-input" value={bookingData.check_in}
                            onChange={(e) => setBookingData({ ...bookingData, check_in: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>{t('check_out')}</label>
                        <input type="date" className="form-input" value={bookingData.check_out}
                            onChange={(e) => setBookingData({ ...bookingData, check_out: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>{t('guests')}</label>
                        <input type="number" min="1" className="form-input" value={bookingData.guests}
                            onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })} />
                    </div>
                    <div className="form-group search-btn-group">
                        <label>&nbsp;</label>
                        <button type="submit" className="btn btn-primary">{t('search_availability')}</button>
                    </div>
                </form>
            </div>

            <div className="rooms-grid">
                {loading ? (<div className="loading">{t('loading_rooms')}</div>) : rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room.id} className="room-card card">
                            <div className="room-image-placeholder">
                                {room.media && room.media.length > 0 ? (
                                    room.media[0].media_type === 'IMAGE' ?
                                        <img src={room.media[0].file} alt={`${t('room')} ${room.number}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                        <video src={room.media[0].file} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted autoPlay loop />
                                ) : <span>🛏️</span>}
                            </div>
                            <div className="room-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 className="room-number">{t('room')} {room.number}</h3>
                                    {room.room_quality && room.room_quality !== 'STANDARD' && (
                                        <span style={{ fontSize: '12px', background: '#ffd700', padding: '3px 8px', borderRadius: '4px' }}>
                                            {getQualityLabel(room.room_quality)}
                                        </span>
                                    )}
                                </div>
                                <p className="room-category">{room.category_name || 'Standard'}</p>
                                <div className="room-features">
                                    <span>👤 {room.capacity || 2} {t('guests')}</span>
                                    <span>📐 {room.area}m²</span>
                                    {room.window_type && <span>{getWindowTypeLabel(room.window_type)}</span>}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                                    {room.has_wifi && <span className="amenity-badge">📶 {t('free_wifi')}</span>}
                                    {room.has_tv && <span className="amenity-badge">📺 TV</span>}
                                    {room.has_air_conditioning && <span className="amenity-badge">❄️ A/C</span>}
                                    {room.has_minibar && <span className="amenity-badge">🍾 {t('minibar')}</span>}
                                    {room.has_safe && <span className="amenity-badge">🔐 Safe</span>}
                                    {room.has_balcony && <span className="amenity-badge">🌅 Balcony</span>}
                                </div>
                                <div className="room-price-book">
                                    <div className="room-price">
                                        <span className="price">ETB {room.price || 150}</span>
                                        <span className="per-night">{t('per_night')}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn" style={{ background: '#ecf0f1', color: '#333' }}
                                            onClick={() => setSelectedRoom(room)}>{t('view_details')}</button>
                                        <button className="btn btn-primary" onClick={() => handleBook(room)}>{t('book_now')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (<div className="no-rooms card">{t('no_rooms')}</div>)}
            </div>

            {selectedRoom && (
                <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>🛏️ {t('room')} {selectedRoom.number}</h2>
                            <button onClick={() => setSelectedRoom(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        {selectedRoom.media && selectedRoom.media.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                                    {selectedRoom.media.map((m) => (
                                        <div key={m.id} style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '1' }}>
                                            {m.media_type === 'IMAGE' ?
                                                <img src={m.file} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                                <video src={m.file} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <h4 style={{ color: '#667eea', marginBottom: '10px' }}>{t('room_info')}</h4>
                                <p><strong>{t('category')}:</strong> {selectedRoom.category_name}</p>
                                <p><strong>{t('quality')}:</strong> {getQualityLabel(selectedRoom.room_quality)}</p>
                                <p><strong>{t('capacity')}:</strong> {selectedRoom.capacity} {t('guests')}</p>
                                <p><strong>{t('area')}:</strong> {selectedRoom.area} m²</p>
                                <p><strong>{t('window')}:</strong> {getWindowTypeLabel(selectedRoom.window_type)}</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#667eea', marginBottom: '10px' }}>{t('amenities')}</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {selectedRoom.has_wifi && <span>✅ {t('free_wifi')}</span>}
                                    {selectedRoom.has_tv && <span>✅ {t('smart_tv')}</span>}
                                    {selectedRoom.has_air_conditioning && <span>✅ {t('air_conditioning')}</span>}
                                    {selectedRoom.has_minibar && <span>✅ {t('minibar')}</span>}
                                    {selectedRoom.has_safe && <span>✅ {t('in_room_safe')}</span>}
                                    {selectedRoom.has_balcony && <span>✅ {t('private_balcony')}</span>}
                                </div>
                            </div>
                        </div>
                        {selectedRoom.description && (
                            <div style={{ marginTop: '20px' }}>
                                <h4 style={{ color: '#667eea', marginBottom: '10px' }}>{t('description')}</h4>
                                <p style={{ color: '#666' }}>{selectedRoom.description}</p>
                            </div>
                        )}
                        <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>ETB {selectedRoom.price}</span>
                                <span style={{ color: '#999' }}>{t('per_night')}</span>
                            </div>
                            <button className="btn btn-primary" onClick={() => { setSelectedRoom(null); handleBook(selectedRoom); }}>
                                {t('book_this_room')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .booking-search-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; align-items: end; }
                .booking-search-form .form-input { 
                    color: #1a1a2e !important; 
                    background-color: #ffffff !important; 
                    border: 1px solid #cbd5e0 !important;
                    font-weight: 500;
                }
                /* Ensure specific visibility for date and number inputs */
                .booking-search-form input[type="date"],
                .booking-search-form input[type="number"] {
                    color: #1a1a2e !important;
                    background-color: #ffffff !important;
                }
                .rooms-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; margin-top: 30px; }
                .room-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
                .room-image-placeholder { height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: white; overflow: hidden; }
                .room-info { padding: 20px; }
                .room-number { margin: 0; color: #2d3748; }
                .room-category { color: #718096; margin: 5px 0 15px 0; }
                .room-features { display: flex; gap: 15px; margin-bottom: 15px; color: #4a5568; font-size: 0.85rem; flex-wrap: wrap; }
                .amenity-badge { font-size: 11px; background: #e8f4f8; color: #2980b9; padding: 4px 8px; border-radius: 4px; }
                .room-price-book { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #edf2f7; padding-top: 15px; }
                .price { font-size: 1.5rem; font-weight: bold; color: #667eea; }
                .per-night { color: #718096; font-size: 0.8rem; margin-left: 4px; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
                .modal-content { background: white; padding: 30px; border-radius: 12px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
}
