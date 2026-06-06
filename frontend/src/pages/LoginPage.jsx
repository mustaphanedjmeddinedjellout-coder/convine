import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const loggedIn = await login(email, password);
            navigate(loggedIn.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] px-5 py-16 text-black">
            <div className="mx-auto max-w-md border border-black/10 bg-white p-8">
                <Link to="/" className="convive-script text-3xl text-black">
                    Convive
                </Link>
                <h1 className="mt-8 text-3xl font-normal">Sign in</h1>
                <p className="mt-3 text-base text-black/60">
                    Customers sign in with the account created for them after payment. Admins use the platform account.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="form-label">Email</span>
                        <input
                            className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="amina.yacine@platform.com"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="form-label">Password</span>
                        <input
                            className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}

                    <button
                        className="auth-button auth-button-fill w-full"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}
