"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings } from "lucide-react";

export default function BankNav() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 p-4">
            <div className="mb-8 px-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    AgroCredit <span className="text-slate-500 text-sm">Bank</span>
                </h1>
            </div>

            <nav className="space-y-1">
                <Link
                    href="/bank/dashboard"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive("/bank/dashboard")
                            ? "bg-emerald-600/20 text-emerald-400"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </Link>

                <Link
                    href="/bank/applications"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive("/bank/applications")
                            ? "bg-emerald-600/20 text-emerald-400"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    Applications
                </Link>

                <Link
                    href="/bank/farmers"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive("/bank/farmers")
                            ? "bg-emerald-600/20 text-emerald-400"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                >
                    <Users className="w-5 h-5" />
                    Farmers
                </Link>

                <div className="pt-8">
                    <p className="px-3 text-xs font-semibold text-slate-500 uppercase mb-2">System</p>
                    <Link
                        href="/bank/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
