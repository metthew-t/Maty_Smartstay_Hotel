'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../../lib/LanguageContext';

function MockChapaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const [seconds, setSeconds] = useState(3);

    const amount = searchParams.get('amount') || '0';
    const tx_ref = searchParams.get('tx_ref') || '';
    const description = searchParams.get('description') || 'Hotel Payment';

    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Redirect back to success
            router.push(`/guest/payments?status=success&tx_ref=${tx_ref}`);
        }
    }, [seconds, router, tx_ref]);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#0066FF',
                    marginBottom: '10px'
                }}>
                    Chapa <span style={{ color: '#00C853' }}>Checkout</span>
                </div>
                <div style={{
                    backgroundColor: '#E3F2FD',
                    color: '#1976D2',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginBottom: '20px'
                }}>
                    SIMULATED BOX
                </div>

                <div style={{ marginBottom: '30px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 5px 0' }}>{t('amount')}</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>ETB {amount}</p>
                </div>

                <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 5px 0' }}>{t('description_label')}</p>
                    <p style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>{description}</p>
                </div>

                <div style={{
                    padding: '20px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '12px',
                    marginBottom: '30px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ width: '40px', height: '24px', backgroundColor: '#94a3b8', borderRadius: '4px' }}></div>
                        <div style={{ width: '40px', height: '24px', backgroundColor: '#94a3b8', borderRadius: '4px' }}></div>
                        <div style={{ width: '40px', height: '24px', backgroundColor: '#94a3b8', borderRadius: '4px' }}></div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#475569' }}>
                        Processing Securely... {seconds}s
                    </p>
                </div>

                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    This is a simulation of the Chapa Payment Portal.<br />
                    In a real application, the guest would enter their details here.
                </div>
            </div>
        </div>
    );
}

export default function MockChapaPage() {
    return (
        <Suspense fallback={<div>Loading simulation...</div>}>
            <MockChapaContent />
        </Suspense>
    );
}
