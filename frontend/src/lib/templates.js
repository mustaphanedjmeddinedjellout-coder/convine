export const VELVET_TEMPLATE = {
    slug: 'velvet',
    name: 'Velvet',
    tagline: 'Cinematic red drape reveal',
    demoPath: '/invite/demo',
    preview: 'velvet',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Red drape opening', 'Scratch date reveal', 'Guest letter', 'RSVP'],
};

export const BLOOM_TEMPLATE = {
    slug: 'bloom',
    name: 'Bloom',
    tagline: 'Blush botanical watercolor romance',
    demoPath: '/invite/demo-bloom',
    preview: 'bloom',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Petal bloom opening', 'Scratch date reveal', 'Deckled letter', 'RSVP'],
};

export const NOIR_TEMPLATE = {
    slug: 'noir',
    name: 'Noir',
    tagline: 'Art deco midnight & gold foil',
    demoPath: '/invite/demo-noir',
    preview: 'noir',
    couple: { bride: 'Amina', groom: 'Yacine' },
    features: ['Gold line reveal', 'Scratch date panels', 'Foil letter', 'RSVP'],
};

export const WEDDING_TEMPLATES = [VELVET_TEMPLATE, BLOOM_TEMPLATE, NOIR_TEMPLATE];

export const TEMPLATE_BY_SLUG = Object.fromEntries(WEDDING_TEMPLATES.map((t) => [t.slug, t]));
