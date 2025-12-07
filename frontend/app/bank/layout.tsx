"use client";

import BankNav from "@/components/BankNav";

export default function BankLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-slate-50 pl-64">
            <BankNav />
            <main className="p-8">
                {children}
            </main>
        </div>
    );
}
