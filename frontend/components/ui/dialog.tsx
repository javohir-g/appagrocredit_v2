// Simple dialog components for compatibility
import * as React from "react"

export const Dialog = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const DialogContent = ({ children }: { children: React.ReactNode }) => <div className="fixed inset-0 bg-white p-6">{children}</div>
export const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>
export const DialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>
export const DialogFooter = ({ children }: { children: React.ReactNode }) => <div className="mt-6 flex justify-end">{children}</div>
export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>
