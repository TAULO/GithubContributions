// src/routes/api/contributions/+server.ts
import { json, error } from '@sveltejs/kit';
import { GITHUB_ACCESS_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

import { QUERY, LEVELS, type IContributionCollection } from '$lib/github';

function getFromTo(yearParam: string | null) {
	let from: string, to: string;

	const year = yearParam ? Number(yearParam) : NaN;

	if (Number.isInteger(year)) {
		from = `${year}-01-01T00:00:00Z`;
		to = `${year}-12-31T23:59:59Z`;
	} else {
		const now = new Date();
		to = now.toISOString();
		from = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000).toISOString();
	}

	return { from, to };
}

export const GET: RequestHandler = async ({ url, fetch }) => {
	const user = url.searchParams.get('user');
	if (!user) throw error(400, 'Missing ?user= parameter');

	const yearParam = url.searchParams.get('year');
	const { from, to } = getFromTo(yearParam);

	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
		},
		body: JSON.stringify({ query: QUERY, variables: { user, from, to } }),
	});

	if (!res.ok) throw error(res.status, 'GitHub request failed');
	const payload = await res.json();

	if (payload.errors) throw error(502, payload.errors[0]?.message ?? 'GraphQL error');

	const contributionsCollection = payload.data?.user?.contributionsCollection;
	if (!contributionsCollection) throw error(502, 'GitHub API returned no contributions');

	const contributionCalendar = contributionsCollection.contributionCalendar;
	if (!contributionCalendar) throw error(502, 'GitHub API returned no contribution calendar');

	const contributions = contributionCalendar.weeks.map((w: any) =>
		w.contributionDays.map((d: any) => ({
			date: d.date,
			count: d.contributionCount,
			level: LEVELS[d.contributionLevel as keyof typeof LEVELS],
		})),
	);

	const contributionYears = contributionsCollection.contributionYears;

	const data: IContributionCollection = {
		total: contributionCalendar.totalContributions,
		contributions,
		contributionYears,
	};

	return json(data, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
