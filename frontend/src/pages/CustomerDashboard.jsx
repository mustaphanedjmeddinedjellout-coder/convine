import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function CustomerDashboard() {
    const { user, logout } = useAuth();
    const [wedding, setWedding] = useState(null);
    const [guestText, setGuestText] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [guestSaving, setGuestSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.getWedding()
            .then((data) => {
                setWedding(data.wedding);
                setGuestText(data.wedding.guests.map((guest) => guest.name).join('\n'));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function saveWedding(event) {
        event.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const data = await api.updateWedding({
                bride_name: wedding.bride_name,
                groom_name: wedding.groom_name,
                event_date: wedding.event_date || null,
                venue: wedding.venue,
                message: wedding.message,
            });
            setWedding(data.wedding);
            setMessage('Invitation details saved.');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function saveGuests(event) {
        event.preventDefault();
        setGuestSaving(true);
        setMessage('');
        setError('');

        const names = guestText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

        try {
            const data = await api.syncGuests(names);
            setWedding((current) => ({ ...current, guests: data.guests }));
            setGuestText(data.guests.map((guest) => guest.name).join('\n'));
            setMessage(`${data.guests.length} guest names saved. Each person gets a personalized invitation.`);
        } catch (err) {
            setError(err.message);
        } finally {
            setGuestSaving(false);
        }
    }

    function updateWeddingField(field, value) {
        setWedding((current) => ({ ...current, [field]: value }));
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p className="text-[#6b5d4d]">Loading...</p>
            </div>
        );
    }

    if (error && !wedding) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-black">
            <header className="border-b border-black/10 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-normal">{wedding.title}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-black/60 sm:inline">{user.email}</span>
                        <button className="auth-button auth-button-outline" onClick={logout}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-2">
                <section className="border border-black/10 bg-white p-6">
                    <h2 className="text-2xl font-normal">Customize invitation</h2>
                    <p className="mt-2 text-sm text-black/60">Template: {wedding.template_slug}</p>

                    <form className="mt-6 space-y-4" onSubmit={saveWedding}>
                        <label className="block">
                            <span className="form-label">Bride</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.bride_name ?? ''}
                                onChange={(e) => updateWeddingField('bride_name', e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Groom</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.groom_name ?? ''}
                                onChange={(e) => updateWeddingField('groom_name', e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Date</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                type="date"
                                value={wedding.event_date ?? ''}
                                onChange={(e) => updateWeddingField('event_date', e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Venue</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.venue ?? ''}
                                onChange={(e) => updateWeddingField('venue', e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Message</span>
                            <textarea
                                className="mt-2 min-h-28 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.message ?? ''}
                                onChange={(e) => updateWeddingField('message', e.target.value)}
                            />
                        </label>

                        <button className="auth-button auth-button-fill" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save invitation'}
                        </button>
                    </form>
                </section>

                <section className="border border-black/10 bg-white p-6">
                    <h2 className="text-2xl font-normal">Guest names</h2>
                    <p className="mt-2 text-base leading-7 text-black/60">
                        Add one name per line. Each guest gets a personalized invitation — for example Mohamed, Fatima, Karim, Nadia.
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={saveGuests}>
                        <textarea
                            className="min-h-56 w-full border border-black/15 px-4 py-3 font-mono text-sm outline-none focus:border-black"
                            value={guestText}
                            onChange={(e) => setGuestText(e.target.value)}
                            placeholder={'Mohamed\nFatima\nKarim\nNadia'}
                        />

                        <button className="auth-button auth-button-fill" type="submit" disabled={guestSaving}>
                            {guestSaving ? 'Saving guests...' : 'Save guest list'}
                        </button>
                    </form>

                    {wedding.guests?.length ? (
                        <div className="mt-6 border-t border-black/10 pt-6">
                            <h3 className="text-lg font-medium">How it reads to each guest</h3>
                            <ul className="mt-3 space-y-2">
                                {wedding.guests.map((guest) => (
                                    <li key={guest.id} className="rounded border border-black/10 px-4 py-3">
                                        Dear <strong>{guest.name}</strong>, you are invited to {wedding.title}.
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </section>
            </main>

            {message ? <p className="mx-auto max-w-5xl px-6 pb-10 text-sm text-[#0065c8]">{message}</p> : null}
            {error ? <p className="mx-auto max-w-5xl px-6 pb-10 text-sm text-red-600">{error}</p> : null}
        </div>
    );
}
