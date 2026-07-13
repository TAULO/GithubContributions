// src/routes/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ContributionData } from '$lib/github';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const user = url.searchParams.get('user') ?? 'TAULO';

    const res = await fetch(`/api/contributions?user=${encodeURIComponent(user)}`);
    if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: 'Failed to load' }));
        throw error(res.status, message);
    }

    const contributions: ContributionData = await res.json();
    return { user, contributions };
};