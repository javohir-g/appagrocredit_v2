"use client";

import { useEffect, useState } from "react";
import { PieChart, Activity, Users, FileText } from "lucide-react";
import { api } from "@/lib/api";

interface DashboardStats {
    total_portfolio: number;
    active_loans: number;
    pending_applications: number;
    risk_level: string;
}

export default function BankDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getBankDashboard();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

    const formatMoney = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Bank Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Portfolio */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <PieChart className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Total Loan Portfolio</p>
                    <h3 className="text-2xl font-bold text-slate-900">{formatMoney(stats.total_portfolio)}</h3>
                </div>

                {/* Active Loans */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Active Loans</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.active_loans}</h3>
                </div>

                {/* Pending Apps */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        {stats.pending_applications > 0 && (
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full animate-pulse">Action Required</span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Pending Applications</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.pending_applications}</h3>
                </div>

                {/* Risk Level */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">Stable</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Portfolio Risk</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.risk_level}</h3>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">New Farmer Registration</p>
                                <p className="text-xs text-slate-500">Aziz Gofurov • 2 hours ago</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500">View Profile</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Loan Repayment Received</p>
                                <p className="text-xs text-slate-500">Farm #123 • $1,250 • 5 hours ago</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500">View Details</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
