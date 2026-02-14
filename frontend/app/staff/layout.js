'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './staff.css';

export default function StaffLayout({ children }) {
    const pathname = usePathname();

    const links = [
        { href: '/staff', label: '📊 Dashboard', icon: '📊' },
        { href: '/staff/requests', label: '🛎️ Requests', icon: '🛎️' },
        { href: '/staff/orders', label: '🍔 Orders', icon: '🍔' },
        { href: '/staff/menu', label: '📋 Menu Mgmt', icon: '📋' },
        { href: '/staff/rooms', label: '🛏️ Rooms Mgmt', icon: '🛏️' },
    ];

    return (
        <div className="staff-layout">
            <aside className="staff-sidebar">
                <div className="sidebar-header">
                    <h2>Staff Operations</h2>
                </div>
                <nav className="staff-nav">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span>{link.label.split(' ')[1]}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <Link href="/" className="back-link">
                        ← Exit Portal
                    </Link>
                </div>
            </aside>
            <main className="staff-main">
                {children}
            </main>
        </div>
    );
}
