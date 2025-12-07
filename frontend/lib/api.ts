// const API_URL = "http://localhost:8000/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://agrocredit-api.onrender.com/api";

export async function fetcher(url: string, options?: RequestInit) {
    const res = await fetch(`${API_URL}${url}`, options);
    if (!res.ok) {
        throw new Error('API request failed');
    }
    return res.json();
}

export const api = {
    getSummary: () => fetcher('/farmers/summary'),
    getLoans: () => fetcher('/farmers/loans'),
    getUtilities: () => fetcher('/farmers/utilities'),
    getRecommendation: () => fetcher('/farmers/recommendations/latest'),
    getProfile: () => fetcher('/farmers/profile'),

    // Bank API
    getBankDashboard: () => fetcher('/bank/dashboard'),
    getBankApplications: () => fetcher('/bank/applications'),
    reviewApplication: (id: number, approved: boolean) =>
        fetcher(`/bank/applications/${id}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ approved })
        }),

    createLoan: (data: { amount: number; term_months: number; purpose: string }) =>
        fetcher('/farmers/loans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }),

    // Documents API
    generateContract: (data: { application_id: number; farmer_name: string; amount: number }) =>
        fetcher('/documents/contract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),
    generateRejection: (data: { application_id: number; farmer_name: string; amount: number }) =>
        fetcher('/documents/rejection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),

    // Notifications & Signing
    getNotifications: () => fetcher('/farmers/notifications'),
    signLoan: (id: number) => fetcher(`/farmers/loans/${id}/sign`, { method: 'POST' }),

    // Payments
    makePayment: (id: number, amount: number) =>
        fetcher(`/farmers/loans/${id}/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        }),
};
