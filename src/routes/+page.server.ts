// src/routes/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ContributionData } from '$lib/github';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const user = url.searchParams.get('user') ?? 'TAULO';
    const year = url.searchParams.get('year');

    const endpoint = `/api/contributions?user=${encodeURIComponent(user)}`;
    const res = await fetch(endpoint);

    if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: 'Failed to load' }));
        throw error(res.status, message);
    }

    const contributions: ContributionData = await res.json();
    return { user, contributions };
};