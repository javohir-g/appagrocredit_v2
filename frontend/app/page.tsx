import Link from "next/link";
import { Sprout, Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
      <main className="flex flex-col gap-8 items-center max-w-2xl w-full">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            AgroCredit AI
          </h1>
          <p className="text-slate-600 text-lg">
            Smart Credit Solutions for Agriculture
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full mt-8">
          {/* Farmer Login */}
          <Link
            href="/register"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Sprout className="w-12 h-12" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">For Farmers</h2>
                <p className="text-emerald-100 text-sm">
                  Credit Management & AI Recommendations
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
          </Link>

          {/* Bank Login */}
          <Link
            href="/bank/applications"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Building2 className="w-12 h-12" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">For Banks</h2>
                <p className="text-blue-100 text-sm">
                  Application Processing & Scoring
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Powered by AI • Version 2.0
          </p>
        </div>
      </main>
    </div>
  );
}
