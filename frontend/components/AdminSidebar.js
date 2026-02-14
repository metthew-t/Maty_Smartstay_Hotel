'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../app/admin/admin.css';

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/rooms', label: 'Rooms' },
        { href: '/admin/bookings', label: 'Bookings' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/settings', label: 'Settings' },
    ];

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h2>SmartStay</h2>
            </div>
            <nav className="admin-nav">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="sidebar-footer">
                <Link href="/" className="back-link">
                    ← Back to Main Site
                </Link>
            </div>
        </div>
    );
}
