'use client';
import { useState, useEffect } from 'react';
import { foodAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function FoodOrderPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomNumber, setRoomNumber] = useState('');
    const [instructions, setInstructions] = useState('');
    const { t } = useLanguage();

    useEffect(() => { loadMenu(); }, [filters]);

    const loadMenu = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await foodAPI.getMenu(filters);
            setMenuItems(Array.isArray(data) ? data : (data.results || []));
        } catch (err) {
            console.error('Failed to load menu:', err);
            setError(err.message || 'Failed to load menu');
        }
        finally { setLoading(false); }
    };

    const addToCart = (item) => {
        const existing = cart.find(c => c.menu_item_id === item.id);
        if (existing) {
            setCart(cart.map(c => c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { menu_item_id: item.id, quantity: 1, name: item.name, price: item.price }]);
        }
    };

    const placeOrder = () => {
        if (cart.length === 0) return;
        const params = new URLSearchParams({
            type: 'food',
            amount: total.toFixed(2),
            items: JSON.stringify(cart.map(item => ({ menu_item_id: item.menu_item_id, quantity: item.quantity }))),
            room_number: roomNumber,
            instructions: instructions,
            items_summary: cart.map(item => `${item.quantity}x ${item.name}`).join(', ')
        });
        window.location.href = `/guest/payments?${params.toString()}`;
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div>
            <div className="page-header"><h1 className="page-title">{t('food_title')}</h1></div>

            <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0 }}>{t('dietary_filters')}</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {[['vegetarian', t('vegetarian')], ['vegan', t('vegan')], ['gluten_free', t('gluten_free')]].map(([filter, label]) => (
                        <label key={filter} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" checked={filters[filter] === 'true'}
                                onChange={(e) => setFilters({ ...filters, [filter]: e.target.checked ? 'true' : undefined })} />
                            <span>{label}</span>
                        </label>
                    ))}
                    <button className="btn" onClick={() => setFilters({})}
                        style={{ marginLeft: '10px', fontSize: '0.8rem', padding: '5px 10px', background: '#e2e8f0' }}>
                        Clear All Filters
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div>
                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>{t('menu')} ({menuItems.length})</h3>
                        {error && <div style={{ color: 'red', padding: '10px', background: '#fff5f5', borderRadius: '4px', marginBottom: '15px' }}>❌ {error}</div>}
                        {loading ? <p>{t('loading_menu')}</p> : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {menuItems.length === 0 && !error && <p style={{ color: '#718096' }}>No menu items found match your criteria.</p>}
                                {menuItems.map(item => (
                                    <div key={item.id} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                                            <p style={{ margin: '0 0 5px 0', color: '#718096', fontSize: '0.9rem' }}>{item.description}</p>

                                            {(item.ingredients || item.calories) && (
                                                <details style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                                                    <summary style={{ cursor: 'pointer', color: '#667eea', fontWeight: 'bold' }}>🥗 {t('health_nutrition_info')}</summary>
                                                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', marginTop: '5px' }}>
                                                        {item.ingredients && <p><strong>{t('ingredients')}:</strong> {item.ingredients}</p>}
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '5px', margin: '10px 0' }}>
                                                            {item.calories && <div className="nutrient-tag">🔥 {item.calories}</div>}
                                                            {item.protein_pct && <div className="nutrient-tag">🥩 Protein: {item.protein_pct}</div>}
                                                            {item.carbs_pct && <div className="nutrient-tag">🍞 Carbs: {item.carbs_pct}</div>}
                                                            {item.fat_pct && <div className="nutrient-tag">🥑 Fat: {item.fat_pct}</div>}
                                                            {item.fiber_pct && <div className="nutrient-tag">🌾 Fiber: {item.fiber_pct}</div>}
                                                        </div>
                                                        {item.health_benefits && (
                                                            <div style={{ marginTop: '5px' }}>
                                                                <strong>{t('benefits')}:</strong>
                                                                <p style={{ whiteSpace: 'pre-line', margin: '5px 0' }}>{item.health_benefits}</p>
                                                            </div>
                                                        )}
                                                        {item.health_considerations && (
                                                            <div style={{ marginTop: '5px' }}>
                                                                <strong>{t('considerations')}:</strong>
                                                                <p style={{ whiteSpace: 'pre-line', margin: '5px 0' }}>{item.health_considerations}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </details>
                                            )}

                                            <p style={{ margin: '10px 0 0 0', fontWeight: 'bold', color: '#667eea' }}>ETB {item.price}</p>
                                        </div>
                                        <button onClick={() => addToCart(item)} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>{t('add_to_cart')}</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="card" style={{ position: 'sticky', top: '20px' }}>
                        <h3 style={{ marginTop: 0 }}>{t('cart')} ({cart.length})</h3>
                        {cart.length === 0 ? <p style={{ color: '#718096' }}>{t('cart_empty')}</p> : (
                            <>
                                {cart.map((item, idx) => (
                                    <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#718096' }}>{t('qty')}: {item.quantity}</div>
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>ETB {(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <span>ETB {total.toFixed(2)}</span>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>{t('room_number')}</label>
                                    <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="e.g. 101"
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '15px' }} />
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>{t('special_instructions')}</label>
                                    <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder={t('notes_placeholder')} rows={2}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                                </div>
                                <button onClick={placeOrder} className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>{t('place_order')}</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .nutrient-tag { background: #edf2f7; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; color: #4a5568; font-weight: 500; }
            `}</style>
        </div>
    );
}
