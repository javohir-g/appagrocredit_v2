"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Cloud, Satellite, CheckCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        farmName: "",
        region: "Tashkent",
        crop: "Wheat"
    });

    const [collectionSteps, setCollectionSteps] = useState([
        { name: "Checking Weather History", status: "pending" },
        { name: "Analyzing Satellite Imagery", status: "pending" },
        { name: "Verifying Land Ownership", status: "pending" },
        { name: "Calculating Soil Quality", status: "pending" }
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
        simulateDataCollection();
    };

    const simulateDataCollection = async () => {
        setLoading(true);
        const steps = [...collectionSteps];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 1200)); // Slower simulation
            steps[i].status = "completed";
            setCollectionSteps([...steps]);
        }

        await new Promise(r => setTimeout(r, 1000));
        router.push('/farmer/home');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-emerald-600 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">AgroCredit AI</h1>
                    <p className="text-emerald-100 text-sm">Join the future of agricultural financing</p>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Aziz Gofurov"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Farm Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Green Valley Farm"
                                    value={formData.farmName}
                                    onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                                        value={formData.region}
                                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                                    >
                                        <option>Tashkent</option>
                                        <option>Samarkand</option>
                                        <option>Fergana</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Main Crop</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                                        value={formData.crop}
                                        onChange={e => setFormData({ ...formData, crop: e.target.value })}
                                    >
                                        <option>Wheat</option>
                                        <option>Cotton</option>
                                        <option>Vegetables</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                Get Started <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Satellite className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">AI Data Collection</h2>
                                <p className="text-sm text-slate-500">Gathering insights for your farm...</p>
                            </div>

                            <div className="space-y-3">
                                {collectionSteps.map((s, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        {s.status === 'completed' ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
                                        )}
                                        <span className={`text-sm font-medium ${s.status === 'completed' ? 'text-slate-900' : 'text-slate-500'}`}>
                                            {s.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
