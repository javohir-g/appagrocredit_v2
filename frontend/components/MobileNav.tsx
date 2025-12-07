"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, User, Sprout, MessageCircle } from "lucide-react";

export default function MobileNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                <Link
                    href="/farmer/home"
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive("/farmer/home") ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Главная</span>
                </Link>

                <Link
                    href="/farmer/loans"
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive("/farmer/loans") ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Кредиты</span>
                </Link>

                <Link
                    href="/farmer/fields"
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive("/farmer/fields") ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                >
                    <Sprout className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Мои поля</span>
                </Link>

                <Link
                    href="/farmer/chat"
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive("/farmer/chat") ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-[10px] font-medium">AI Агент</span>
                </Link>

                <Link
                    href="/farmer/profile"
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive("/farmer/profile") ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                >
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Профиль</span>
                </Link>
            </div>
        </div>
    );
}
