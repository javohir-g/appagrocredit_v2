"use client";

import { Sprout, CloudRain, Droplets } from "lucide-react";

export default function FieldsPage() {
    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-slate-900 mb-4">My Fields</h1>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sprout className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Main Field</h3>
                <p className="text-sm text-slate-600 mb-4">Area: 150.5 ha | Crop: Wheat</p>

                <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                            <CloudRain className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-slate-500">Humidity</span>
                        </div>
                        <p className="font-bold text-slate-900">45%</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-slate-500">Irrigation</span>
                        </div>
                        <p className="font-bold text-slate-900">In 2 days</p>
                    </div>
                </div>
            </div>
            <div className="text-center py-8">
                <p className="text-slate-400 text-sm">Данные обновляются в реальном времени с датчиков IoT</p>
            </div>
        </div>
    );
}
