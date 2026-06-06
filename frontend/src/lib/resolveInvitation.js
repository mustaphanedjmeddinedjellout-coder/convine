import { DEMO_INVITATION } from './invitationDemo';

const DEMO_TOKENS = {
    demo: 'velvet',
    'demo-bloom': 'bloom',
    'demo-noir': 'noir',
};

export function resolveInvitationToken(token) {
    if (token in DEMO_TOKENS) {
        return {
            isDemo: true,
            templateSlug: DEMO_TOKENS[token],
            data: DEMO_INVITATION,
            apiToken: null,
        };
    }

    return {
        isDemo: false,
        templateSlug: null,
        data: null,
        apiToken: token,
    };
}

const LEGACY_TEMPLATE_MAP = {
    classic: 'velvet',
    berry: 'bloom',
    minimal: 'noir',
};

export function resolveTemplateSlug(templateSlugFromApi, demoSlug) {
    const slug = templateSlugFromApi || demoSlug || 'velvet';
    return LEGACY_TEMPLATE_MAP[slug] ?? slug;
}
