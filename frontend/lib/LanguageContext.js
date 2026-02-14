'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [isRtl, setIsRtl] = useState(false);

    useEffect(() => {
        // Load saved language from localStorage
        const savedLang = localStorage.getItem('guest_language');
        if (savedLang && translations[savedLang]) {
            setLanguage(savedLang);
            const langInfo = languages.find(l => l.code === savedLang);
            setIsRtl(langInfo?.rtl || false);
        }
    }, []);

    const changeLanguage = (langCode) => {
        if (translations[langCode]) {
            setLanguage(langCode);
            localStorage.setItem('guest_language', langCode);
            const langInfo = languages.find(l => l.code === langCode);
            setIsRtl(langInfo?.rtl || false);
        }
    };

    // Translation function
    const t = (key) => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, isRtl, languages }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
