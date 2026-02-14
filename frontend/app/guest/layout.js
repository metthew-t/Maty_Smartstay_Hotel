'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import './guest.css';

function GuestLayoutContent({ children }) {
    const pathname = usePathname();
    const { t, isRtl } = useLanguage();

    const links = [
        { href: '/guest', label: t('nav_dashboard'), icon: '🏠' },
        { href: '/guest/chat', label: t('nav_chat'), icon: '💬' },
        { href: '/guest/booking', label: t('nav_booking'), icon: '🛏️' },
        { href: '/guest/food', label: t('nav_food'), icon: '🍽️' },
        { href: '/guest/services', label: t('nav_services'), icon: '🛎️' },
        { href: '/guest/payments', label: t('nav_payments'), icon: '💳' },
        { href: '/guest/notifications', label: t('nav_notifications') || 'Notifications', icon: '🔔' },
        { href: '/guest/profile', label: t('nav_profile'), icon: '👤' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
    };

    return (
        <div className="guest-layout" dir={isRtl ? 'rtl' : 'ltr'}>
            <aside className="guest-sidebar" style={isRtl ? { right: 0, left: 'auto' } : {}}>
                <div className="sidebar-header">
                    <h2>{t('sidebar_title')}</h2>
                    <LanguageSelector />
                </div>
                <nav className="guest-nav">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <Link href="/" className="back-link">
                        {t('back_home')}
                    </Link>
                    <button onClick={handleLogout} className="logout-btn" style={{
                        width: '100%',
                        marginTop: '10px',
                        padding: '10px',
                        background: '#fed7d7',
                        color: '#c53030',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        {t('logout')}
                    </button>
                </div>
            </aside>
            <main className="guest-main" style={isRtl ? { marginRight: '260px', marginLeft: 0 } : {}}>
                {children}
            </main>
        </div>
    );
}

export default function GuestLayout({ children }) {
    return (
        <LanguageProvider>
            <GuestLayoutContent>{children}</GuestLayoutContent>
        </LanguageProvider>
    );
}
