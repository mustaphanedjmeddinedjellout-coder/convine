import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

function inviteLink(token) {
    if (!token) {
        return null;
    }

    return `${window.location.origin}/invite/${token}`;
}

export default function CustomerDashboard() {
    const { user, logout } = useAuth();
    const [wedding, setWedding] = useState(null);
    const [guestText, setGuestText] = useState('');
    const [photoFiles, setPhotoFiles] = useState([]);
    const [stats, setStats] = useState({ accepted: 0, refused: 0, pending: 0 });
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
                setPhotoFiles([]);
                setStats({
                    accepted: data.wedding.accepted_count ?? 0,
                    refused: data.wedding.refused_count ?? 0,
                    pending: data.wedding.pending_count ?? 0,
                });
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function saveWedding(event) {
        event.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('bride_name', wedding.bride_name ?? '');
        formData.append('groom_name', wedding.groom_name ?? '');
        formData.append('event_date', wedding.event_date ?? '');
        formData.append('event_time', wedding.event_time ?? '');
        formData.append('venue', wedding.venue ?? '');
        formData.append('venue_address', wedding.venue_address ?? '');
        formData.append('google_maps_url', wedding.google_maps_url ?? '');
        formData.append('message', wedding.message ?? '');

        (wedding.photos ?? []).forEach((photo) => {
            if (typeof photo === 'string' && photo.trim()) {
                formData.append('photos[]', photo);
            }
        });

        photoFiles.slice(0, 6 - (wedding.photos ?? []).length).forEach((file) => {
            formData.append('photos[]', file);
        });

        try {
            const data = await api.updateWedding(formData);
            setWedding(data.wedding);
            setPhotoFiles([]);
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
            setMessage(`${data.guests.length} guest links ready. Share each personalized link via WhatsApp.`);
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
                        <p className="mt-1 text-sm text-black/50">Manage your cinematic wedding invitation</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link className="auth-button auth-button-outline text-sm" to="/invite/demo" target="_blank">
                            Preview demo
                        </Link>
                        <span className="hidden text-sm text-black/60 sm:inline">{user.email}</span>
                        <button className="auth-button auth-button-outline" onClick={logout}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-2">
                <section className="border border-black/10 bg-white p-6">
                    <h2 className="text-2xl font-normal">Invitation details</h2>
                    <p className="mt-2 text-sm text-black/60">
                        These details power the guest experience — drape opening, names, date reveal, letter, and more.
                    </p>

                    <div className="mt-6 mb-4 grid gap-3 sm:grid-cols-3">
                        <div className="border border-black/10 bg-white p-4 text-center">
                            <p className="text-xs text-black/40">Accepted</p>
                            <p className="mt-1 text-2xl font-semibold text-[#0f7a44]">{stats.accepted}</p>
                        </div>
                        <div className="border border-black/10 bg-white p-4 text-center">
                            <p className="text-xs text-black/40">Refused</p>
                            <p className="mt-1 text-2xl font-semibold text-[#8a2e2e]">{stats.refused}</p>
                        </div>
                        <div className="border border-black/10 bg-white p-4 text-center">
                            <p className="text-xs text-black/40">Pending</p>
                            <p className="mt-1 text-2xl font-semibold text-[#6b5d4d]">{stats.pending}</p>
                        </div>
                    </div>

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

                        <div className="grid gap-4 sm:grid-cols-2">
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
                                <span className="form-label">Time (24h)</span>
                                <input
                                    className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                    type="time"
                                    value={wedding.event_time ?? ''}
                                    onChange={(e) => updateWeddingField('event_time', e.target.value)}
                                />
                            </label>
                        </div>

                        <label className="block">
                            <span className="form-label">Venue name</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.venue ?? ''}
                                onChange={(e) => updateWeddingField('venue', e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Venue address</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.venue_address ?? ''}
                                onChange={(e) => updateWeddingField('venue_address', e.target.value)}
                                placeholder="12 Avenue des Roses, Paris"
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Invitation message</span>
                            <textarea
                                className="mt-2 min-h-28 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.message ?? ''}
                                onChange={(e) => updateWeddingField('message', e.target.value)}
                                placeholder="We are delighted to invite you to celebrate our wedding..."
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Photos from gallery</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-white"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setPhotoFiles(Array.from(e.target.files ?? []))}
                            />
                            <p className="mt-2 text-sm text-black/50">Select up to 6 images from your device.</p>
                        </label>

                        <label className="block">
                            <span className="form-label">Google Maps link</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.google_maps_url ?? ''}
                                onChange={(e) => updateWeddingField('google_maps_url', e.target.value)}
                                placeholder="https://www.google.com/maps/..."
                            />
                        </label>

                        {Array.isArray(wedding.photos) && wedding.photos.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {wedding.photos.map((photo) => (
                                    <img key={photo} src={photo} alt="Wedding" className="h-32 w-full object-cover" />
                                ))}
                            </div>
                        ) : null}

                        <button className="auth-button auth-button-fill" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save invitation'}
                        </button>
                    </form>
                </section>

                <section className="border border-black/10 bg-white p-6">
                    <h2 className="text-2xl font-normal">Guest links</h2>
                    <p className="mt-2 text-base leading-7 text-black/60">
                        Add one name per line. Each guest receives a unique link with their name in the invitation letter.
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
                            <h3 className="text-lg font-medium">Personalized links</h3>
                            <ul className="mt-3 space-y-3">
                                {wedding.guests.map((guest) => {
                                    const link = inviteLink(guest.token);

                                    return (
                                        <li key={guest.id} className="rounded border border-black/10 px-4 py-3">
                                            <p className="font-medium">{guest.name}</p>
                                            {link ? (
                                                <a
                                                    className="mt-1 block truncate text-sm text-[#0065c8] hover:underline"
                                                    href={link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {link}
                                                </a>
                                            ) : (
                                                <p className="mt-1 text-sm text-black/50">Re-save guests to generate link</p>
                                            )}
                                            {guest.rsvp_status && (
                                                <p className="mt-1 text-xs uppercase tracking-wider text-black/40">
                                                    RSVP: {guest.rsvp_status}
                                                </p>
                                            )}
                                        </li>
                                    );
                                })}
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
