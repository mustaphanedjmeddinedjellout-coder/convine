function getCsrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

let csrfReady = false;

async function ensureCsrf() {
    if (csrfReady) {
        return;
    }

    await fetch('/api/csrf', { credentials: 'include' });
    csrfReady = true;
}

async function request(url, options = {}) {
    const method = options.method ?? 'GET';

    if (method !== 'GET') {
        await ensureCsrf();
    }

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
        ...(options.headers ?? {}),
    };

    const response = await fetch(url, {
        credentials: 'include',
        ...options,
        headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.message ?? data.errors?.email?.[0] ?? 'Request failed.';
        throw new Error(message);
    }

    return data;
}

export const api = {
    getUser: () => request('/api/user'),
    login: (email, password) =>
        request('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    logout: () => request('/api/logout', { method: 'POST' }),
    adminWeddings: () => request('/api/admin/weddings'),
    createCustomer: (payload) =>
        request('/api/admin/customers', {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
    getWedding: () => request('/api/wedding'),
    updateWedding: (payload) =>
        request('/api/wedding', {
            method: 'PATCH',
            body: JSON.stringify(payload),
        }),
    syncGuests: (names) =>
        request('/api/wedding/guests', {
            method: 'PUT',
            body: JSON.stringify({ names }),
        }),
    getInvitation: (token) => request(`/api/invite/${token}`),
    submitRsvp: (token, status) =>
        request(`/api/invite/${token}/rsvp`, {
            method: 'POST',
            body: JSON.stringify({ status }),
        }),
};
