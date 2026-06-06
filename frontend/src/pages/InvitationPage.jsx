import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { resolveInvitationToken, resolveTemplateSlug } from '../lib/resolveInvitation';
import VelvetInvitation from '../templates/velvet/VelvetInvitation';
import BloomInvitation from '../templates/bloom/BloomInvitation';
import NoirInvitation from '../templates/noir/NoirInvitation';

const TEMPLATE_VIEWS = {
    velvet: VelvetInvitation,
    bloom: BloomInvitation,
    noir: NoirInvitation,
};

export default function InvitationPage() {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [templateSlug, setTemplateSlug] = useState('velvet');
    const [isDemo, setIsDemo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const context = resolveInvitationToken(token);

        if (context.isDemo) {
            setIsDemo(true);
            setTemplateSlug(context.templateSlug);
            setData(context.data);
            setLoading(false);
            return;
        }

        setIsDemo(false);
        setLoading(true);
        setError('');

        api.getInvitation(context.apiToken)
            .then((payload) => {
                setData(payload);
                setTemplateSlug(resolveTemplateSlug(payload.wedding.template_slug, null));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    async function handleRsvp(status) {
        const result = await api.submitRsvp(token, status);
        setData((current) => ({
            ...current,
            guest: { ...current.guest, rsvp_status: result.guest.rsvp_status },
        }));
    }

    if (loading) {
        return (
            <div className="invitation-root flex min-h-svh items-center justify-center">
                <p className="font-serif text-lg tracking-widest text-[#8b4a5c] uppercase">Opening...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="invitation-root flex min-h-svh items-center justify-center px-6 text-center">
                <p className="font-serif text-lg text-[#8b4a5c]">{error || 'Invitation not found.'}</p>
            </div>
        );
    }

    const TemplateView = TEMPLATE_VIEWS[templateSlug] ?? VelvetInvitation;

    return <TemplateView data={data} isDemo={isDemo} onRsvp={handleRsvp} />;
}
