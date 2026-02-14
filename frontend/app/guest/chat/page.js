'use client';
import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import './chat.css';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { t } = useLanguage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const history = await chatAPI.getHistory();
            setMessages(history.map(msg => ([
                { text: msg.message, sender: 'user' },
                { text: msg.response, sender: 'bot' }
            ])).flat());
        } catch (err) {
            console.error('Failed to load history:', err);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setLoading(true);

        try {
            const response = await chatAPI.sendMessage(userMessage);
            setMessages(prev => [...prev, { text: response.response, sender: 'bot' }]);
        } catch (err) {
            console.error('Failed to send message:', err);
            setMessages(prev => [...prev, {
                text: t('chat_error'),
                sender: 'bot'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickQuestions = [
        t('quick_hello'),
        t('quick_room'),
        t('quick_food'),
        t('quick_services'),
        t('quick_payment'),
    ];

    return (
        <div className="chat-container">
            <div className="page-header">
                <h1 className="page-title">{t('chat_title')}</h1>
            </div>

            <div className="chat-card">
                <div className="chat-messages">
                    {messages.length === 0 && (
                        <div className="welcome-message">
                            <div className="bot-avatar">🤖</div>
                            <h3>{t('chat_welcome')}</h3>
                            <p>{t('chat_intro')}</p>
                            <div className="quick-questions">
                                {quickQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        className="quick-question-btn"
                                        onClick={() => {
                                            setInput(q);
                                            setTimeout(() => {
                                                document.querySelector('.chat-form').dispatchEvent(
                                                    new Event('submit', { cancelable: true, bubbles: true })
                                                );
                                            }, 100);
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.sender}`}>
                            {msg.sender === 'bot' && <div className="message-avatar">🤖</div>}
                            <div className="message-bubble">
                                {msg.text}
                            </div>
                            {msg.sender === 'user' && <div className="message-avatar">👤</div>}
                        </div>
                    ))}

                    {loading && (
                        <div className="message bot">
                            <div className="message-avatar">🤖</div>
                            <div className="message-bubble typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="chat-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chat_placeholder')}
                        className="chat-input"
                        disabled={loading}
                    />
                    <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
                        {t('chat_send')}
                    </button>
                </form>
            </div>
        </div>
    );
}
