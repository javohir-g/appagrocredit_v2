"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, Calendar, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ApplicationsPage() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [term, setTerm] = useState("12");
    const [purpose, setPurpose] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.createLoan({
                amount: parseFloat(amount),
                term_months: parseInt(term),
                purpose: purpose
            });
            setSuccess(true);
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/farmer/loans");
            }, 2000);
        } catch (error) {
            console.error("Failed to create loan application:", error);
            alert("Ошибка при создании заявки");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Заявка отправлена!</h2>
                <p className="text-slate-500 mb-4">Мы рассмотрим вашу заявку в ближайшее время.</p>
                <Link href="/farmer/loans" className="text-emerald-600 font-medium hover:underline">
                    Вернуться к кредитам
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-md mx-auto min-h-screen bg-slate-50">
            <div className="flex items-center gap-2 mb-6">
                <Link href="/farmer/home" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-xl font-bold text-slate-900">Новая заявка</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Сумма кредита ($)
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="number"
                            required
                            min="100"
                            max="100000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-3 text-lg font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                            placeholder="5000"
                        />
                    </div>
                </div>

                {/* Term */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Срок (месяцев)
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none appearance-none"
                        >
                            <option value="3">3 месяца</option>
                            <option value="6">6 месяцев</option>
                            <option value="12">12 месяцев</option>
                            <option value="24">24 месяца</option>
                            <option value="36">36 месяцев</option>
                        </select>
                    </div>
                </div>

                {/* Purpose */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Цель кредита
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <textarea
                            required
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none resize-none"
                            placeholder="Например: закупка семян, ремонт техники..."
                        />
                    </div>
                </div>

                {/* Summary */}
                {amount && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Ежемесячный платеж:</span>
                            <span className="font-bold text-blue-900">
                                ${((parseFloat(amount) * (1 + 0.12 * (parseInt(term) / 12))) / parseInt(term)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-blue-700">Ставка:</span>
                            <span className="font-bold text-blue-900">12%</span>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
                >
                    {loading ? "Отправка..." : "Отправить заявку"}
                </button>
            </form>
        </div>
    );
}
