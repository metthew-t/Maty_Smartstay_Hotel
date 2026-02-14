'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import styles from './page.module.css';

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : { ...formData };

        try {
            if (isLogin) {
                const response = await authAPI.login(payload);
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
                const profile = await authAPI.getProfile();
                redirectByUserRole(profile.role);
            } else {
                await authAPI.register(payload);
                setIsLogin(true);
                alert('Account created successfully! Please login.');
            }
        } catch (err) {
            console.error('Auth error:', err);
            let errorMessage = 'Authentication failed.';
            if (err.data) {
                if (typeof err.data === 'string') errorMessage = err.data;
                else if (err.data.detail) errorMessage = err.data.detail;
                else {
                    errorMessage = Object.entries(err.data)
                        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`)
                        .join(' | ');
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const redirectByUserRole = (role) => {
        const routes = { ADMIN: '/admin', STAFF: '/staff' };
        router.push(routes[role] || '/guest');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>SmartStay</h1>
                <p className={styles.subtitle}>{isLogin ? 'Login to your account' : 'Register your luxury account'}</p>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleAuth}>
                    {!isLogin && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className={styles.inputGroup}>
                                <label>First Name</label>
                                <input name="first_name" type="text" placeholder="John" value={formData.first_name} onChange={handleChange} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Last Name</label>
                                <input name="last_name" type="text" placeholder="Doe" value={formData.last_name} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                    </div>

                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label>Username</label>
                            <input name="username" type="text" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className={styles.switchBtn} onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Register now' : 'Login here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
