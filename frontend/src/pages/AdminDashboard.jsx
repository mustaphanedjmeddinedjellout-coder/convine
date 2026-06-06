import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [weddings, setWeddings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.adminWeddings()
            .then((data) => setWeddings(data.weddings))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-black">
            <header className="border-b border-black/10 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-normal">All invitations</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-black/60 sm:inline">{user.email}</span>
                        <Link className="auth-button auth-button-fill" to="/admin/customers/new">
                            Create customer
                        </Link>
                        <button className="auth-button auth-button-outline" onClick={logout}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">
                <p className="max-w-2xl text-base leading-7 text-black/60">
                    You see every customer wedding here. Customers only see and edit their own invitation — they never get admin access.
                </p>

                {loading ? <p className="mt-8 text-black/50">Loading invitations...</p> : null}
                {error ? <p className="mt-8 text-red-600">{error}</p> : null}

                {!loading && !error ? (
                    <div className="mt-8 overflow-hidden border border-black/10 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-black/10 bg-[#fafaf8] text-sm text-[#6b5d4d]">
                                <tr>
                                    <th className="px-5 py-4">Wedding</th>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Guests</th>
                                    <th className="px-5 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weddings.length === 0 ? (
                                    <tr>
                                        <td className="px-5 py-8 text-black/50" colSpan={4}>
                                            No customer accounts yet. Create one after a customer pays and picks a template.
                                        </td>
                                    </tr>
                                ) : (
                                    weddings.map((wedding) => (
                                        <tr key={wedding.id} className="border-t border-black/5">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{wedding.title}</p>
                                                <p className="mt-1 text-black/50">{wedding.template_slug}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p>{wedding.owner.name}</p>
                                                <p className="mt-1 text-black/50">{wedding.owner.email}</p>
                                            </td>
                                            <td className="px-5 py-4">{wedding.guest_count}</td>
                                            <td className="px-5 py-4 capitalize">{wedding.status}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
