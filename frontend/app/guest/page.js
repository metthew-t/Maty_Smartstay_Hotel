'use client';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export default function GuestDashboard() {
    const router = useRouter();
    const { t } = useLanguage();

    const quickActions = [
        { title: t('action_chat'), icon: '💬', href: '/guest/chat', color: '#667eea' },
        { title: t('action_book'), icon: '🛏️', href: '/guest/booking', color: '#f093fb' },
        { title: t('action_my_bookings'), icon: '📅', href: '/guest/bookings', color: '#4facfe' },
        { title: t('action_food'), icon: '🍽️', href: '/guest/food', color: '#ffd32a' },
        { title: t('action_orders'), icon: '🥡', href: '/guest/orders', color: '#ff7f50' },
        { title: t('action_services'), icon: '🛎️', href: '/guest/services', color: '#43e97b' },
        { title: t('action_payments'), icon: '💳', href: '/guest/payments', color: '#fa709a' },
        { title: t('action_profile'), icon: '👤', href: '/guest/profile', color: '#feca57' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">{t('welcome_title')}</h1>
            </div>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#2d3748', marginTop: 0 }}>{t('quick_actions')}</h2>
                <p style={{ color: '#718096' }}>{t('quick_actions_subtitle')}</p>
            </div>

            <div className="card-grid">
                {quickActions.map((action) => (
                    <div
                        key={action.href}
                        className="quick-action-card"
                        onClick={() => router.push(action.href)}
                        style={{ borderTop: `4px solid ${action.color}` }}
                    >
                        <div className="quick-action-icon">{action.icon}</div>
                        <h3 className="quick-action-title">{action.title}</h3>
                    </div>
                ))}
            </div>

            <div className="card">
                <h3 style={{ color: '#2d3748', marginTop: 0 }}>{t('about_title')}</h3>
                <p style={{ color: '#718096', lineHeight: '1.6' }}>
                    {t('about_intro')}
                </p>
                <ul style={{ color: '#718096', lineHeight: '1.8' }}>
                    <li>💬 <strong>{t('about_chat')}</strong></li>
                    <li>🛏️ <strong>{t('about_booking')}</strong></li>
                    <li>🍽️ <strong>{t('about_food')}</strong></li>
                    <li>🛎️ <strong>{t('about_services')}</strong></li>
                    <li>💳 <strong>{t('about_payments')}</strong></li>
                    <li>👤 <strong>{t('about_profile')}</strong></li>
                </ul>
            </div>
        </div>
    );
}
