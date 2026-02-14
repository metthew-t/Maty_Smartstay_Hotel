'use client';
import { useState, useEffect } from 'react';
import { serviceAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestData, setRequestData] = useState({ service: '', notes: '', requested_datetime: new Date().toISOString().slice(0, 16) });
    const { t } = useLanguage();

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [servicesData, myRequestsData] = await Promise.all([serviceAPI.list(), serviceAPI.getMyRequests()]);
            setServices(Array.isArray(servicesData) ? servicesData : (servicesData.results || []));
            setMyRequests(Array.isArray(myRequestsData) ? myRequestsData : (myRequestsData.results || []));
        } catch (err) { console.error('Failed to load services data:', err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!requestData.service) { alert(t('please_select_service')); return; }
        try {
            await serviceAPI.request({ service: parseInt(requestData.service), notes: requestData.notes, requested_datetime: requestData.requested_datetime, booking: 1 });
            alert(t('service_success'));
            setRequestData({ ...requestData, service: '', notes: '' });
            loadData();
        } catch (err) {
            console.error('Failed to request service:', err);
            alert(t('service_failed'));
        }
    };

    return (
        <div className="services-page">
            <div className="page-header"><h1 className="page-title">{t('services_title')}</h1></div>

            <div className="services-grid">
                <div className="request-section">
                    <div className="card">
                        <h2 style={{ marginTop: 0 }}>{t('request_service')}</h2>
                        <form onSubmit={handleSubmit} className="service-form">
                            <div className="form-group">
                                <label>{t('select_service')}</label>
                                <select className="form-input" value={requestData.service} onChange={(e) => setRequestData({ ...requestData, service: e.target.value })}>
                                    <option value="">{t('choose_service')}</option>
                                    {services.map(s => (<option key={s.id} value={s.id}>{s.name} - ETB {s.price}</option>))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{t('date_time')}</label>
                                <input type="datetime-local" className="form-input" value={requestData.requested_datetime}
                                    onChange={(e) => setRequestData({ ...requestData, requested_datetime: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{t('special_notes')}</label>
                                <textarea className="form-input" rows="3" placeholder={t('notes_placeholder')} value={requestData.notes}
                                    onChange={(e) => setRequestData({ ...requestData, notes: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>{t('send_request')}</button>
                        </form>
                    </div>

                    <div className="card" style={{ marginTop: '30px' }}>
                        <h3>{t('available_services')}</h3>
                        <div className="service-list-items">
                            {services.map(s => (
                                <div key={s.id} className="service-item">
                                    <div className="service-name">{s.name}</div>
                                    <div className="service-desc">{s.description}</div>
                                    <div className="service-price">ETB {s.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="history-section">
                    <div className="card h-full">
                        <h2 style={{ marginTop: 0 }}>{t('my_requests')}</h2>
                        {loading ? (<div className="loading">{t('loading_requests')}</div>) : myRequests.length > 0 ? (
                            <div className="requests-timeline">
                                {myRequests.map((req) => (
                                    <div key={req.id} className="request-card">
                                        <div className="request-header">
                                            <span className="request-service">{req.service_name}</span>
                                            <span className={`status-badge status-${req.status.toLowerCase()}`}>{req.status}</span>
                                        </div>
                                        <div className="request-time">{t('requested_for')}: {new Date(req.requested_datetime).toLocaleString()}</div>
                                        {req.notes && <div className="request-notes">"{req.notes}"</div>}
                                    </div>
                                ))}
                            </div>
                        ) : (<div className="no-data">{t('no_requests')}</div>)}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                .service-item { padding: 15px 0; border-bottom: 1px solid #edf2f7; }
                .service-name { font-weight: bold; color: #2d3748; }
                .service-desc { font-size: 0.9rem; color: #718096; margin: 5px 0; }
                .service-price { color: #667eea; font-weight: 600; }
                .request-card { padding: 15px; border: 1px solid #edf2f7; border-radius: 12px; margin-bottom: 15px; background: #f8fafc; }
                .request-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .request-service { font-weight: bold; color: #2d3748; }
                .request-time { font-size: 0.85rem; color: #718096; }
                .request-notes { margin-top: 10px; font-style: italic; font-size: 0.9rem; color: #4a5568; }
                .status-badge { font-size: 0.75rem; padding: 4px 8px; border-radius: 12px; font-weight: 600; text-transform: uppercase; }
                .status-pending { background: #fff3cd; color: #856404; }
                .status-completed { background: #d4edda; color: #155724; }
                .status-in_progress { background: #cce5ff; color: #004085; }
            `}</style>
        </div>
    );
}
