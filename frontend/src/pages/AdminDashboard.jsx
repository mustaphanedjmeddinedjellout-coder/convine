import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [weddings, setWeddings] = useState([]);
    const [summary, setSummary] = useState({ accepted: 0, refused: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.adminWeddings()
            .then((data) => {
                setWeddings(data.weddings);
                setSummary(data.summary ?? { accepted: 0, refused: 0, pending: 0 });
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const invitations = weddings.flatMap((wedding) =>
        (wedding.invitations ?? []).map((invitation) => ({
            ...invitation,
            weddingTitle: wedding.title,
            weddingOwner: wedding.owner?.name,
        })),
    );

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
                    This dashboard tracks invitation responses across all customer weddings. Customers still only edit their own invitation.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="border border-black/10 bg-white p-5">
                        <p className="text-sm uppercase tracking-wider text-black/40">Accepted</p>
                        <p className="mt-2 text-3xl font-semibold text-[#0f7a44]">{summary.accepted}</p>
                    </div>
                    <div className="border border-black/10 bg-white p-5">
                        <p className="text-sm uppercase tracking-wider text-black/40">Refused</p>
                        <p className="mt-2 text-3xl font-semibold text-[#8a2e2e]">{summary.refused}</p>
                    </div>
                    <div className="border border-black/10 bg-white p-5">
                        <p className="text-sm uppercase tracking-wider text-black/40">Pending</p>
                        <p className="mt-2 text-3xl font-semibold text-[#6b5d4d]">{summary.pending}</p>
                    </div>
                </div>

                {loading ? <p className="mt-8 text-black/50">Loading invitations...</p> : null}
                {error ? <p className="mt-8 text-red-600">{error}</p> : null}

                {!loading && !error ? (
                    <div className="mt-8 overflow-hidden border border-black/10 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-black/10 bg-[#fafaf8] text-sm text-[#6b5d4d]">
                                <tr>
                                    <th className="px-5 py-4">Invitation</th>
                                    <th className="px-5 py-4">Wedding</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.length === 0 ? (
                                    <tr>
                                        <td className="px-5 py-8 text-black/50" colSpan={4}>
                                            No invitations yet.
                                        </td>
                                    </tr>
                                ) : (
                                    invitations.map((invitation) => (
                                        <tr key={invitation.id} className="border-t border-black/5">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{invitation.name}</p>
                                                <p className="mt-1 text-black/50">{invitation.weddingOwner}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p>{invitation.weddingTitle}</p>
                                            </td>
                                            <td className="px-5 py-4 capitalize">
                                                <span className="rounded-full bg-[#fafaf8] px-3 py-1 text-xs font-semibold tracking-wider">
                                                    {invitation.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {invitation.invite_url ? (
                                                    <a className="text-[#0065c8] hover:underline" href={invitation.invite_url} target="_blank" rel="noreferrer">
                                                        Open
                                                    </a>
                                                ) : (
                                                    <span className="text-black/40">No link</span>
                                                )}
                                            </td>
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
