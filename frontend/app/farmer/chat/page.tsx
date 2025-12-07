"use client";

import { Send, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ChatPage() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { role: 'assistant', text: 'Здравствуйте! Я ваш AI ассистент по агро-финансам. Чем могу помочь сегодня?' }
    ]);

    const handleSend = () => {
        if (!message.trim()) return;

        setChat([...chat, { role: 'user', text: message }]);
        setMessage("");

        // Mock response
        setTimeout(() => {
            setChat(prev => [...prev, { role: 'assistant', text: 'Спасибо за вопрос! Я сейчас анализирую данные вашего хозяйства чтобы дать точный ответ...' }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-md mx-auto bg-slate-50">
            <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="font-bold text-slate-900">AI Агент</h1>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Онлайн
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                ? 'bg-emerald-600 text-white rounded-br-none'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
                <div className="relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Задайте вопрос..."
                        className="w-full bg-slate-50 border-none rounded-full pl-5 pr-12 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
