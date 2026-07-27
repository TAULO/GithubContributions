import type { PageServerLoad } from './$types';
import { getContributionsCalendar } from '$lib/github';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const user = url.searchParams.get('user') || 'TAULO';
	const year = url.searchParams.get('year');

	return await getContributionsCalendar(user, year, fetch);
};
