'use client';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageSelector() {
    const { language, setLanguage, t, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="language-selector" ref={dropdownRef}>
            <button
                className="language-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('select_language')}
            >
                <span className="lang-flag">{currentLang.flag}</span>
                <span className="lang-name">{currentLang.name}</span>
                <span className="lang-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="language-dropdown">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`language-option ${language === lang.code ? 'active' : ''}`}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                        >
                            <span className="lang-flag">{lang.flag}</span>
                            <span className="lang-name">{lang.name}</span>
                            {language === lang.code && <span className="check">✓</span>}
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
                .language-selector {
                    position: relative;
                    margin-top: 15px;
                }
                .language-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    color: var(--text-dark);
                    font-size: 0.95rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(4px);
                }
                .language-btn:hover {
                    background: rgba(255, 255, 255, 0.7);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                .lang-flag {
                    font-size: 1.4rem;
                }
                .lang-name {
                    flex: 1;
                    text-align: left;
                }
                .lang-arrow {
                    font-size: 0.7rem;
                    color: var(--text-medium);
                    opacity: 0.7;
                }
                .language-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    margin-top: 8px;
                    background: var(--bg-card);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    z-index: 1000;
                    overflow: hidden;
                    animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    backdrop-filter: blur(20px);
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .language-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 16px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-medium);
                    font-size: 0.95rem;
                    font-weight: 500;
                    transition: all 0.2s;
                    text-align: left;
                }
                .language-option:hover {
                    background: rgba(79, 70, 229, 0.05);
                    color: var(--primary-color);
                    padding-left: 20px;
                }
                .language-option.active {
                    background: rgba(79, 70, 229, 0.1);
                    color: var(--primary-color);
                    font-weight: 600;
                }
                .check {
                    margin-left: auto;
                    color: var(--primary-color);
                    font-weight: bold;
                }
            `}</style>

        </div>
    );
}
