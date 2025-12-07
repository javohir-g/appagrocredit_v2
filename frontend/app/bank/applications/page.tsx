"use client";

import { useEffect, useState } from "react";
import { Check, X, AlertTriangle, Sprout, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";

interface Application {
    id: number;
    farmer_name: string;
    farm_name: string;
    amount: number;
    term_months: number;
    purpose: string;
    credit_score: number;
    status: string;
    created_at: string;
    yield_potential: string;
    risk_factors: string[];
    ai_score_breakdown: { [key: string]: number };
}

export default function BankApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedApp, setExpandedApp] = useState<number | null>(null);
    const [documentModal, setDocumentModal] = useState<{ open: boolean; title: string; content: string; type: 'approve' | 'reject'; appId: number | null }>({
        open: false,
        title: "",
        content: "",
        type: 'approve',
        appId: null
    });

    const fetchApps = async () => {
        try {
            const data = await api.getBankApplications();
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleReviewClick = async (app: Application, type: 'approve' | 'reject') => {
        try {
            // Generate Document
            const doc = type === 'approve'
                ? await api.generateContract({ application_id: app.id, farmer_name: app.farmer_name, amount: app.amount })
                : await api.generateRejection({ application_id: app.id, farmer_name: app.farmer_name, amount: app.amount });

            setDocumentModal({
                open: true,
                title: doc.title,
                content: doc.content,
                type,
                appId: app.id
            });
        } catch (error) {
            console.error("Failed to generate document", error);
            alert("Failed to generate document");
        }
    };

    const confirmAction = async () => {
        if (!documentModal.appId) return;

        try {
            await api.reviewApplication(documentModal.appId, documentModal.type === 'approve');
            setDocumentModal({ ...documentModal, open: false });
            fetchApps();
        } catch (error) {
            console.error("Failed to process request", error);
            alert("Failed to process request");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading applications...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Loan Applications Queue</h1>

            {applications.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-slate-400">No pending applications found.</p>
                </div>
            )}

            <div className="grid gap-4">
                {applications.map((app) => (
                    <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                        <div className="p-6 flex flex-col md:flex-row gap-6">
                            {/* Farmer Info */}
                            <div className="w-full md:w-64 flex flex-col gap-2 md:border-r border-slate-100 md:pr-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">
                                        {app.farmer_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{app.farmer_name}</p>
                                        <p className="text-xs text-slate-500">{app.farm_name}</p>
                                    </div>
                                </div>
                                <div className="mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">AI Risk Score</p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-2xl font-bold ${app.credit_score >= 700 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {app.credit_score}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400">Yield Potential</p>
                                            <p className="text-xs font-medium text-emerald-700">{app.yield_potential}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Loan Details & Actions */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">${app.amount.toLocaleString()}</h3>
                                            <p className="text-sm text-slate-500">{app.term_months} months • {app.purpose}</p>
                                        </div>
                                        <button
                                            onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                                            className="text-slate-400 hover:text-slate-600 p-1"
                                        >
                                            {expandedApp === app.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* AI Analysis Preview */}
                                    <div className="flex gap-2 flex-wrap">
                                        {app.risk_factors.map((risk, idx) => (
                                            <span key={idx} className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> {risk}
                                            </span>
                                        ))}
                                        {app.risk_factors.length === 0 && (
                                            <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                                                <Sprout className="w-3 h-3" /> Low Risk
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-50 mt-auto">
                                    <button
                                        onClick={() => handleReviewClick(app, 'reject')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleReviewClick(app, 'approve')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium shadow-sm transition-colors"
                                    >
                                        <Check className="w-4 h-4" /> Review & Approve
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expanded AI Details */}
                        {expandedApp === app.id && (
                            <div className="px-6 pb-6 pt-0 bg-slate-50/50 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-900 mt-4 mb-3">AI Analysis Breakdown</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(app.ai_score_breakdown).map(([key, score]) => (
                                        <div key={key} className="bg-white p-3 rounded-xl border border-slate-200">
                                            <p className="text-xs text-slate-500 mb-1">{key}</p>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full" style={{ width: `${score}%` }}></div>
                                            </div>
                                            <p className="text-right text-xs font-bold mt-1">{score}/100</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Document Modal */}
            {documentModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${documentModal.type === 'approve' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{documentModal.title}</h3>
                            </div>
                            <button onClick={() => setDocumentModal({ ...documentModal, open: false })} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                            {documentModal.content}
                        </div>

                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl">
                            <button
                                onClick={() => setDocumentModal({ ...documentModal, open: false })}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`px-6 py-2 rounded-lg text-white font-medium shadow-lg transition-transform active:scale-95 ${documentModal.type === 'approve'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                                    }`}
                            >
                                {documentModal.type === 'approve' ? 'Sign & Approve' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
