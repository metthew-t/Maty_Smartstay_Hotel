'use client';
import { useState, useEffect } from 'react';
import { settingsAPI } from '@/lib/api';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        site_name: '',
        contact_email: '',
        maintenance_mode: false,
        booking_enabled: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await settingsAPI.get();
            setSettings(data);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setMessage('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await settingsAPI.update(settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
            setMessage('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return <div className="loading">Loading settings...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">System Settings</h1>
            </div>

            {message && (
                <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="settings-container">
                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="form-group">
                        <label htmlFor="site_name">Site Name</label>
                        <input
                            type="text"
                            id="site_name"
                            name="site_name"
                            value={settings.site_name}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact_email">Contact Email</label>
                        <input
                            type="email"
                            id="contact_email"
                            name="contact_email"
                            value={settings.contact_email}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="maintenance_mode"
                                checked={settings.maintenance_mode}
                                onChange={handleChange}
                            />
                            <span>Maintenance Mode</span>
                        </label>
                        <p className="help-text">When enabled, the site will be unavailable to regular users</p>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="booking_enabled"
                                checked={settings.booking_enabled}
                                onChange={handleChange}
                            />
                            <span>Enable Bookings</span>
                        </label>
                        <p className="help-text">Allow users to make new bookings</p>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={fetchSettings}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
