"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function NotificationBell() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const checkNotifications = async () => {
            try {
                const notes = await api.getNotifications();
                const safeNotes = Array.isArray(notes) ? notes : [];
                const unread = safeNotes.filter((n: any) => n.type === 'alert').length;
                setCount(unread);
            } catch (e) {
                console.error("Failed to fetch notifications", e);
            }
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <Link href="/farmer/notifications" className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell className="w-6 h-6 text-slate-600" />
            {count > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] items-center justify-center text-white flex border-2 border-white">
                    {count}
                </span>
            )}
        </Link>
    );
}
