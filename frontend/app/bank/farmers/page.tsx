"use client";

import { useEffect, useState } from "react";
import { User, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, X, CreditCard } from "lucide-react";
import { api } from "@/lib/api";

interface Credit {
    id: number;
    amount: number;
    remaining: number;
    rate: number;
    term_months: number;
    status: string;
    paid: number;
    progress: number;
}

interface Farmer {
    id: number;
    name: string;
    farm: string;
    score: number;
    active_credits: number;
    scoreCategory: "high" | "medium" | "low";
    justification: {
        strengths: string[];
        weaknesses: string[];
        summary: string;
    };
}

export default function BankFarmersPage() {
    const [expandedFarmer, setExpandedFarmer] = useState<number | null>(null);
    const [loanModalFarmer, setLoanModalFarmer] = useState<Farmer | null>(null);
    const [farmerLoans, setFarmerLoans] = useState<Credit[]>([]);

    const farmers: Farmer[] = [
        {
            id: 1,
            name: "Aziz Gofurov",
            farm: "Petrov Family Farm",
            score: 85,
            active_credits: 1,
            scoreCategory: "high",
            justification: {
                strengths: [
                    "Excellent repayment history (90% on-time rate)",
                    "Diversified crop portfolio reducing risk",
                    "Strong land ownership (150+ acres)",
                    "Modern irrigation infrastructure"
                ],
                weaknesses: [
                    "Limited prior loan experience",
                    "Single-source income dependency"
                ],
                summary: "High creditworthiness with strong agricultural assets and proven track record."
            }
        },
        {
            id: 2,
            name: "Maria Ivanova",
            farm: "Sunrise Valley Farm",
            score: 68,
            active_credits: 2,
            scoreCategory: "medium",
            justification: {
                strengths: [
                    "Moderate repayment history (75% on-time)",
                    "Owns equipment (tractors, harvesters)",
                    "5 years farming experience"
                ],
                weaknesses: [
                    "Past loan default 2 years ago",
                    "Limited land size (40 acres)",
                    "Aging equipment needs replacement",
                    "Single crop dependency (wheat only)"
                ],
                summary: "Average risk profile. Shows improvement but requires close monitoring."
            }
        },
        {
            id: 3,
            name: "Sergey Novikov",
            farm: "Green Start Farm",
            score: 42,
            active_credits: 0,
            scoreCategory: "low",
            justification: {
                strengths: [
                    "High motivation and recent training",
                    "Access to local agricultural support programs"
                ],
                weaknesses: [
                    "First-time farmer with no credit history",
                    "Leased land (no ownership)",
                    "Minimal equipment and infrastructure",
                    "No established market channels",
                    "High debt-to-income ratio"
                ],
                summary: "High risk. Requires significant support, smaller loan amounts, and close mentorship."
            }
        }
    ];

    const handleShowLoans = async (farmer: Farmer) => {
        setLoanModalFarmer(farmer);

        if (farmer.id === 1) {
            // Aziz Gofurov - fetch real loans
            try {
                const loans = await api.getLoans();
                setFarmerLoans(loans);
            } catch (error) {
                console.error("Failed to fetch loans", error);
                setFarmerLoans([]);
            }
        } else {
            // Mock data for other farmers
            const mockLoans: Credit[] = farmer.id === 2 ? [
                { id: 101, amount: 30000, remaining: 18000, rate: 12, term_months: 24, status: 'active', paid: 12000, progress: 40 },
                { id: 102, amount: 25000, remaining: 10000, rate: 11, term_months: 18, status: 'active', paid: 15000, progress: 60 }
            ] : [];
            setFarmerLoans(mockLoans);
        }
    };

    const getScoreColor = (category: string) => {
        switch (category) {
            case "high": return "text-emerald-600 bg-emerald-50 border-emerald-200";
            case "medium": return "text-amber-600 bg-amber-50 border-amber-200";
            case "low": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-slate-600 bg-slate-50 border-slate-200";
        }
    };

    const getScoreIcon = (category: string) => {
        switch (category) {
            case "high": return <TrendingUp className="w-5 h-5" />;
            case "medium": return <Minus className="w-5 h-5" />;
            case "low": return <TrendingDown className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Farmers</h1>
                    <p className="text-sm text-slate-500">Client Scoring Overview</p>
                </div>
            </div>

            <div className="space-y-3">
                {farmers.map((farmer) => (
                    <div
                        key={farmer.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                    >
                        {/* Farmer Header */}
                        <div
                            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => setExpandedFarmer(expandedFarmer === farmer.id ? null : farmer.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{farmer.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-slate-500">{farmer.farm}</p>
                                            {farmer.active_credits > 0 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShowLoans(farmer);
                                                    }}
                                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                                                >
                                                    Active Credits
                                                </button>
                                            )}
                                            {farmer.active_credits === 0 && (
                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                                                    No Active Credits
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${getScoreColor(farmer.scoreCategory)}`}>
                                        {getScoreIcon(farmer.scoreCategory)}
                                        <span className="font-bold text-lg">{farmer.score}/100</span>
                                    </div>
                                    {expandedFarmer === farmer.id ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedFarmer === farmer.id && (
                            <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
                                {/* Summary */}
                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Overall Assessment</h4>
                                    <p className="text-sm text-slate-600">{farmer.justification.summary}</p>
                                </div>

                                {/* Strengths */}
                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                    <h4 className="font-bold text-emerald-900 mb-2">✓ Strengths</h4>
                                    <ul className="space-y-1">
                                        {farmer.justification.strengths.map((strength, idx) => (
                                            <li key={idx} className="text-sm text-emerald-800">• {strength}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weaknesses */}
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <h4 className="font-bold text-red-900 mb-2">⚠ Weaknesses</h4>
                                    <ul className="space-y-1">
                                        {farmer.justification.weaknesses.map((weakness, idx) => (
                                            <li key={idx} className="text-sm text-red-800">• {weakness}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Loan Details Modal */}
            {loanModalFarmer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setLoanModalFarmer(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{loanModalFarmer.name}</h3>
                                <p className="text-sm text-slate-500">Active Credits</p>
                            </div>
                            <button
                                onClick={() => setLoanModalFarmer(null)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Loans List */}
                        <div className="p-4 space-y-3">
                            {farmerLoans.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    Нет активных кредитов
                                </div>
                            ) : (
                                farmerLoans.map((loan) => (
                                    <div key={loan.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 rounded-lg">
                                                    <CreditCard className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Credit #{loan.id}</h4>
                                                    <p className="text-sm text-slate-500">{loan.term_months} months • {loan.rate}%</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">Amount</p>
                                                <p className="text-lg font-bold text-slate-900">${loan.amount.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-slate-600">
                                                <span>Progress</span>
                                                <span>{loan.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all"
                                                    style={{ width: `${loan.progress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-600 font-medium">Paid: ${loan.paid.toLocaleString()}</span>
                                                <span className="text-amber-600 font-medium">Remaining: ${loan.remaining.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
