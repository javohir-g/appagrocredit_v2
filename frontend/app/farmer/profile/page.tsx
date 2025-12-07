"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Settings, Tractor, MapPin, Calendar, Mail, Phone, Shield } from "lucide-react";
import { api } from "@/lib/api";

interface FarmerProfile {
    id: number;
    email: string;
    full_name: string;
    credit_score: number;
    farm_name: string;
    farm_size: number;
    joined_date: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<FarmerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-4 flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!profile) {
        return <div className="p-4 text-center">Failed to load profile.</div>;
    }

    return (
        <div className="p-4 max-w-md mx-auto space-y-4">
            <h1 className="text-xl font-bold text-slate-900 mb-4">Profile</h1>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{profile.full_name}</h2>
                <p className="text-slate-500 text-sm mb-4">Individual Entrepreneur</p>

                <div className="flex gap-2 w-full">
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-slate-500 mb-1">Rating</p>
                        <p className="font-bold text-slate-900 flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3 text-emerald-600" />
                            {profile.credit_score}
                        </p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-slate-500 mb-1">Farm</p>
                        <p className="font-bold text-slate-900">{profile.farm_size} ha</p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium">{profile.email}</p>
                    </div>
                </div>
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <Tractor className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Farm Name</p>
                        <p className="text-sm font-medium">{profile.farm_name}</p>
                    </div>
                </div>
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Registration Date</p>
                        <p className="text-sm font-medium">{profile.joined_date}</p>
                    </div>
                </div>
                <div className="p-4 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Region</p>
                        <p className="text-sm font-medium">Tashkent Region</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <button className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-900">Settings</span>
                    </div>
                </button>
                <button className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:bg-red-50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-600 group-hover:text-red-700">Logout</span>
                    </div>
                </button>
            </div>

            <p className="text-center text-xs text-slate-400 pt-4">AgroCredit App v2.0.0</p>
        </div>
    );
}
