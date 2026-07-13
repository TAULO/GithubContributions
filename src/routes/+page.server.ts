import type { PageServerLoad } from './$types';
import { getContributions } from '$lib/github';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const user = url.searchParams.get('user') ?? 'TAULO';
    const year = url.searchParams.get('year');

    return await getContributions(user, year, fetch);
};