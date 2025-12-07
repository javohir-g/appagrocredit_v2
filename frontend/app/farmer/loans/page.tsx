"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronRight, FileCheck, AlertCircle, CreditCard, X } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Credit {
    id: number;
    amount: number;
    remaining: number;
    rate: number;
    term_months: number; // Corrected from term
    status: string;
    paid: number;
    progress: number;
    next_payment: number;
    due_date: string;
}

export default function LoansPage() {
    const [loans, setLoans] = useState<Credit[]>([]);
    const [signingLoan, setSigningLoan] = useState<number | null>(null);
    const [paymentModal, setPaymentModal] = useState<{ id: number; amount: string } | null>(null);

    const fetchLoans = async () => {
        try {
            const data = await api.getLoans();
            setLoans(data);
        } catch (error) {
            console.error("Failed to fetch loans", error);
        }
    };

    useEffect(() => {
        fetchLoans();
        const interval = setInterval(fetchLoans, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSign = async () => {
        if (!signingLoan) return;
        try {
            await api.signLoan(signingLoan);
            setSigningLoan(null);
            fetchLoans();
        } catch (error) {
            console.error("Failed to sign", error);
            alert("Failed to sign contract");
        }
    };

    const handlePayment = async () => {
        if (!paymentModal) return;
        const val = parseFloat(paymentModal.amount);
        if (isNaN(val) || val <= 0) return alert("Enter valid amount");

        try {
            await api.makePayment(paymentModal.id, val);
            setPaymentModal(null);
            fetchLoans(); // Refresh to see updated progress
            alert("Payment Successful!");
        } catch (error) {
            console.error("Failed to pay", error);
            alert("Payment failed");
        }
    };

    return (
        <div className="p-4 pb-24 max-w-md mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-900">My Credits</h1>
                <Link href="/farmer/applications" className="bg-emerald-600 text-white p-2 rounded-full shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform">
                    <Plus className="w-5 h-5" />
                </Link>
            </div>

            <div className="space-y-4">
                {loans.map((loan) => (
                    <div key={loan.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        {/* Status Strip */}
                        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${loan.status === 'active' ? 'bg-emerald-500' :
                            loan.status === 'waiting_signature' ? 'bg-amber-500' : 'bg-slate-300'
                            }`} />

                        <div className="flex justify-between items-start mb-4 pl-2">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">${loan.amount.toLocaleString()}</h3>
                                <p className="text-xs text-slate-500">Rate {loan.rate}% • Term {loan.term_months} months</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${loan.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                                loan.status === 'waiting_signature' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {loan.status === 'waiting_signature' ? 'Wait Sign' : loan.status}
                            </span>
                        </div>

                        {loan.status === 'active' && (
                            <>
                                <div className="space-y-3 pl-2">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">Paid (${loan.paid.toLocaleString()})</span>
                                            <span className="font-medium text-slate-900">{loan.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${loan.progress}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] text-slate-400">Next Payment</p>
                                            <p className="text-sm font-bold text-slate-900">${loan.next_payment.toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => setPaymentModal({ id: loan.id, amount: '' })}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md shadow-blue-500/20"
                                        >
                                            <CreditCard className="w-3 h-3" /> Pay Now
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {loan.status === 'waiting_signature' && (
                            <div className="pl-2 mt-2">
                                <button
                                    onClick={() => setSigningLoan(loan.id)}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <FileCheck className="w-5 h-5" /> Sign Contract
                                </button>
                                <p className="text-center text-xs text-slate-500 mt-2">Action Required to Activate Loan</p>
                            </div>
                        )}

                        {loan.status === 'pending' && (
                            <div className="pl-2 mt-2 flex items-center gap-2 text-slate-500 bg-slate-50 p-3 rounded-xl text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>Application under review</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Signing Modal (Existing) */}
            {signingLoan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    {/* ... (Same as before) ... */}
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                        {/* Re-implement simplified version since I am overwriting the whole file */}
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Sign Contract</h2>
                            <p className="text-sm text-slate-500">Loan #{signingLoan}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-600 mb-6 h-48 overflow-y-auto">
                            <p>AGREEMENT...</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setSigningLoan(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                            <button onClick={handleSign} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl">Sign Now</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal (New) */}
            {paymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
                        <button onClick={() => setPaymentModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CreditCard className="w-7 h-7" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Make Payment</h2>
                            <p className="text-xs text-slate-500">Secure transaction</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0.00"
                                        value={paymentModal.amount}
                                        onChange={e => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
