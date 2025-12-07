"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, FileCheck, Info, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'alert' | 'info';
    link: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await api.getNotifications();
                setNotifications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading updates...</div>;

    return (
        <div className="p-4 max-w-md mx-auto min-h-screen pb-24">
            <h1 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                    <Bell className="w-5 h-5 text-slate-600" />
                </div>
                Notifications
            </h1>

            {(notifications || []).length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Bell className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-medium">No New Notifications</p>
                    <p className="text-xs text-slate-400">We'll notify you about important events</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((note) => (
                        <Link
                            href={note.link}
                            key={note.id}
                            className={`block p-4 rounded-xl border transition-all active:scale-98 ${note.type === 'alert'
                                ? 'bg-amber-50 border-amber-100'
                                : 'bg-white border-slate-200 shadow-sm'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg shrink-0 ${note.type === 'alert' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {note.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold text-sm mb-1 ${note.type === 'alert' ? 'text-amber-900' : 'text-slate-900'
                                            }`}>
                                            {note.title}
                                        </h3>
                                        <span className="text-[10px] text-slate-400">Now</span>
                                    </div>
                                    <p className={`text-xs leading-relaxed ${note.type === 'alert' ? 'text-amber-800' : 'text-slate-500'
                                        }`}>
                                        {note.message}
                                    </p>

                                    {note.type === 'alert' && (
                                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-white/50 px-2 py-1 rounded-md">
                                            Take Action <ChevronRight className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
