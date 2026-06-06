import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function CreateCustomerPage() {
    const [form, setForm] = useState({
        name: '',
        title: '',
        email_local: '',
        template_slug: 'classic',
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError('');
        setResult(null);

        try {
            const payload = {
                name: form.name,
                title: form.title,
                template_slug: form.template_slug,
            };

            if (form.email_local.trim()) {
                payload.email_local = form.email_local.trim();
            }

            const data = await api.createCustomer(payload);
            setResult(data);
            setForm({ name: '', title: '', email_local: '', template_slug: 'classic' });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-black">
            <header className="border-b border-black/10 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-3xl items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-normal">Create customer account</h1>
                    </div>
                    <Link className="auth-button auth-button-outline" to="/admin">
                        Back
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-6 py-10">
                <p className="text-base leading-7 text-black/60">
                    Use this after the customer pays via BaridiMob/CCP and chooses a template. Send them the generated login — never your admin password.
                </p>

                <form className="mt-8 space-y-5 border border-black/10 bg-white p-6" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="form-label">Customer name</span>
                        <input
                            className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                            value={form.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="Amina Yacine"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="form-label">Wedding title</span>
                        <input
                            className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                            value={form.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            placeholder="Amina & Yacine Wedding"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="form-label">Login email (optional)</span>
                        <div className="mt-2 flex overflow-hidden border border-black/15">
                            <input
                                className="w-full px-4 py-3 outline-none"
                                value={form.email_local}
                                onChange={(e) => updateField('email_local', e.target.value)}
                                placeholder="amina.yacine"
                            />
                            <span className="flex items-center bg-[#fafaf8] px-4 text-sm text-black/50">@platform.com</span>
                        </div>
                        <p className="mt-2 text-sm text-black/50">Leave blank to auto-generate something like customer-154.</p>
                    </label>

                    <label className="block">
                        <span className="form-label">Template</span>
                        <select
                            className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                            value={form.template_slug}
                            onChange={(e) => updateField('template_slug', e.target.value)}
                        >
                            <option value="classic">Classic</option>
                            <option value="berry">Berry</option>
                            <option value="minimal">Minimal</option>
                        </select>
                    </label>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}

                    <button className="auth-button auth-button-fill" type="submit" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create account'}
                    </button>
                </form>

                {result ? (
                    <div className="mt-8 border border-[#0065c8]/20 bg-white p-6">
                        <h2 className="text-lg font-medium text-[#6b4a34]">Send these login details to the customer</h2>
                        <dl className="mt-4 space-y-3 text-base">
                            <div>
                                <dt className="text-black/50">Email</dt>
                                <dd className="font-semibold">{result.customer.email}</dd>
                            </div>
                            <div>
                                <dt className="text-black/50">Password</dt>
                                <dd className="font-mono text-lg">{result.password}</dd>
                            </div>
                        </dl>
                        <p className="mt-4 text-sm text-black/60">
                            This password is shown once. Copy it now and send it over Facebook Messenger.
                        </p>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
