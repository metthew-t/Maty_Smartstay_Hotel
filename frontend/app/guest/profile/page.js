'use client';
import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function ProfilePage() {
    const [profile, setProfile] = useState({ username: '', email: '', phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const { t } = useLanguage();

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        try {
            const data = await authAPI.getProfile();
            setProfile(data);
        } catch (err) { console.error('Failed to load profile:', err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await authAPI.updateProfile(profile);
            setMessage(t('profile_updated'));
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
            setMessage(t('profile_failed'));
        } finally { setSaving(false); }
    };

    if (loading) return <div className="loading">{t('loading_profile')}</div>;

    return (
        <div>
            <div className="page-header"><h1 className="page-title">{t('profile_title')}</h1></div>

            {message && (
                <div className={message.includes('success') || message.includes(t('profile_updated')) ? 'success-message' : 'error-message'}>
                    {message}
                </div>
            )}

            <div className="card">
                <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('username')}</label>
                        <input type="text" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('email')}</label>
                        <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('phone')}</label>
                        <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>{t('address')}</label>
                        <textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} rows={3}
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' }} />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? t('saving') : t('save_changes')}
                    </button>
                </form>
            </div>
        </div>
    );
}
