"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    CreditCard,
    FileText,
    TrendingUp,
    Droplets,
    AlertCircle,
    ArrowRight,
    Sprout,
    MessageCircle,
    Zap,
    Flame
} from "lucide-react";
import { api } from "@/lib/api";
import NotificationBell from "@/components/NotificationBell";

export default function FarmerHome() {
    interface FarmerSummary {
        total_debt: number;
        active_credits: number;
        total_paid: number;
        credit_score: number;
    }

    interface Utility {
        type: string;
        value: number;
        unit: string;
        diff: number;
    }

    interface Recommendation {
        title: string;
        message: string;
        type: string;
    }

    const [summary, setSummary] = useState<FarmerSummary>({
        total_debt: 0,
        active_credits: 0,
        total_paid: 0,
        credit_score: 0
    });

    const [utilities, setUtilities] = useState<Utility[]>([]);
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sumRes, utilRes, recRes] = await Promise.all([
                    api.getSummary(),
                    api.getUtilities(),
                    api.getRecommendation()
                ]);

                setSummary(sumRes);
                setUtilities(utilRes);
                setRecommendation(recRes);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const formatMoney = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    };

    const getUtilityIcon = (type: string) => {
        switch (type) {
            case 'electricity': return <Zap className="w-5 h-5 text-amber-600" />;
            case 'gas': return <Flame className="w-5 h-5 text-orange-600" />;
            case 'water': return <Droplets className="w-5 h-5 text-blue-600" />;
            default: return <Zap className="w-5 h-5" />;
        }
    };

    const getUtilityColor = (type: string) => {
        switch (type) {
            case 'electricity': return 'bg-amber-50 border-amber-100';
            case 'gas': return 'bg-orange-50 border-orange-100';
            case 'water': return 'bg-blue-50 border-blue-100';
            default: return 'bg-slate-50 border-slate-100';
        }
    };

    const getUtilityBg = (type: string) => {
        switch (type) {
            case 'electricity': return 'bg-amber-100';
            case 'gas': return 'bg-orange-100';
            case 'water': return 'bg-blue-100';
            default: return 'bg-slate-100';
        }
    }

    const getUtilityLabel = (type: string) => {
        switch (type) {
            case 'electricity': return 'Electricity';
            case 'gas': return 'Gas';
            case 'water': return 'Water';
            default: return type;
        }
    }

    if (loading) {
        return <div className="p-4 flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center py-2">
                <div>
                    <h1 className="text-xl font-bold">AgroCredit</h1>
                    <p className="text-sm text-slate-500">Welcome, Aziz</p>
                </div>
                <div className="flex items-center gap-2">
                    <NotificationBell />
                    <Link href="/farmer/profile" className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300 hover:border-emerald-500 transition-colors cursor-pointer">
                        <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">AG</div>
                    </Link>
                </div>
            </div>

            {/* Total Credits Summary */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Total Debt</p>
                        <p className="text-3xl font-bold">{formatMoney(summary.total_debt)}</p>
                    </div>
                    <CreditCard className="w-12 h-12 text-white/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-blue-100 text-xs mb-1">Active Credits</p>
                        <p className="text-xl font-bold">{summary.active_credits}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-xs mb-1">Credit Score</p>
                        <p className="text-xl font-bold">{summary.credit_score}</p>
                    </div>
                </div>
                <Link href="/farmer/loans" className="mt-4 inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full">
                    Manage Credits <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* AI Recommendation of the Day */}
            {recommendation && (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Droplets className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">AI RECOMMENDATION</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">{recommendation.title}</h3>
                            <p className="text-sm text-white/90 leading-relaxed">{recommendation.message}</p>
                        </div>
                    </div>
                    <Link href="/farmer/chat" className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors mt-2">
                        Ask AI <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* Utility Meters */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Farm Meters</h2>
                    <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                        Submit Readings
                    </button>
                </div>

                <div className="space-y-3">
                    {utilities.map((util, idx) => (
                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${getUtilityColor(util.type)}`}>
                            <div className={`p-2 rounded-lg ${getUtilityBg(util.type)}`}>
                                {getUtilityIcon(util.type)}
                            </div>
                            <div className="flex-1">
                                <p className={`text-xs font-medium mb-0.5 capitalize`}>{getUtilityLabel(util.type)}</p>
                                <p className="text-lg font-bold text-slate-900">{util.value.toLocaleString()} {util.unit}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Per Month</p>
                                <p className="text-sm font-semibold text-slate-900">+{util.diff} {util.unit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
                <Link href="/farmer/fields" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Sprout className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">My Fields</h3>
                    </div>
                    <p className="text-xs text-slate-500">Status & Recommendations</p>
                </Link>

                <Link href="/farmer/applications" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Applications</h3>
                    </div>
                    <p className="text-xs text-slate-500">Submit New Application</p>
                </Link>

                <Link href="/farmer/notifications" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                    </div>
                    <p className="text-xs text-slate-500">Check New Events</p>
                </Link>

                <Link href="/farmer/chat" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">AI Assistant</h3>
                    </div>
                    <p className="text-xs text-slate-500">Ask a Question</p>
                </Link>
            </div>
        </div>
    );
}
