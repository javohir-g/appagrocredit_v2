"use client";

import MobileNav from "@/components/MobileNav";

export default function FarmerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {children}
            <MobileNav />
        </div>
    );
}
