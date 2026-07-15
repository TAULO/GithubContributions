import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '../../../../.svelte-kit/types/src/routes/api/contributions-calendar/$types';
import { GITHUB_ACCESS_TOKEN } from '$env/static/private';
import { CONTRIBUTION_QUERY } from '$lib/github';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const user = url.searchParams.get('user');
	if (!user) throw error(400, 'Missing ?user= parameter');

	const fromParam = url.searchParams.get('from'); // expects YYYY-MM-DD
	const toParam = url.searchParams.get('to');
	if (!fromParam) throw error(400, 'Missing ?from= parameter');

	// validate shape before trusting it
	if (!/^\d{4}-\d{2}-\d{2}$/.test(fromParam)) {
		throw error(400, 'from must be YYYY-MM-DD');
	}

	const fromDate = new Date(`${fromParam}T00:00:00Z`);
	if (Number.isNaN(fromDate.getTime())) {
		throw error(400, 'from is not a valid date');
	}

	const from = fromDate.toISOString();
	const to = toParam ? new Date(`${toParam}T00:00:00Z`).toISOString() : from;

	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
		},
		body: JSON.stringify({
			query: CONTRIBUTION_QUERY,
			variables: { user, from, to },
		}),
	});

	if (!res.ok) throw error(res.status, 'GitHub request failed');
	const payload = await res.json();

	if (payload.errors) throw error(502, payload.errors[0]?.message ?? 'GraphQL error');

	const {
		commitContributionsByRepository,
		pullRequestContributionsByRepository,
		issueContributionsByRepository,
	} = payload.data.user.contributionsCollection;

	// lift GitHub's { issue }/{ pullRequest } wrapper off each node so app types stay flat
	const flattenNodes = <T>(repos: any[], pick: (node: any) => T) =>
		repos.map((repo) => ({
			...repo,
			contributions: { ...repo.contributions, nodes: repo.contributions.nodes.map(pick) },
		}));

	const data = {
		commitContributionsByRepository, // already flat from GitHub
		issueContributionsByRepository: flattenNodes(issueContributionsByRepository, (n) => n.issue),
		pullRequestContributionsByRepository: flattenNodes(
			pullRequestContributionsByRepository,
			(n) => n.pullRequest,
		),
	};

	return json(data, {
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	});
};
