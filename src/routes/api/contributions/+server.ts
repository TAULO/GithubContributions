import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GITHUB_ACCESS_TOKEN } from '$env/static/private';
import { CONTRIBUTION_QUERY, type IContributionByRepository } from '$lib/github';

// lift GitHub's { issue }/{ pullRequest } wrapper off each node so app types stay flat
// what GitHub sends: repo wrapper whose commits carry the { issue }/{ pullRequest } envelope
interface IRawRepo<TRawNode> {
	repository: {
		nameWithOwner: string;
		url: string;
		primaryLanguage: { name: string; color: string } | null;
		languages: {
			totalCount: number;
			totalSize: number;
			edges: { size: number; node: { name: string; color: string } }[];
		};
	};
	contributions: { nodes: TRawNode[] };
}

interface IRawCommitNode {
	commitCount: number;
	occurredAt: string;
}
interface IRawPullRequestNode {
	pullRequest: { title: string; url: string; createdAt: string; state: string };
}
interface IRawIssueNode {
	issue: {
		title: string;
		url: string;
		createdAt: string;
		closed: boolean;
		labels: { nodes: { name: string; color: string }[] };
	};
}

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
		totalCommitContributions,
		totalPullRequestContributions,
		totalIssueContributions,
		restrictedContributionsCount,
	} = payload.data.user.contributionsCollection;

	const unwrapNodes = <T>(conn: { nodes: T[] }): T[] => conn.nodes;
	const flatten = <TRaw, TItem>(
		repos: IRawRepo<TRaw>[],
		pick: (node: TRaw) => TItem,
	): IContributionByRepository<TItem>[] =>
		repos.map((repo) => {
			const languages = repo.repository.languages;
			return {
				repository: {
					...repo.repository,
					languages: {
						totalCount: languages.totalCount,
						totalSize: languages.totalSize,
						items: languages.edges.map((e) => ({
							name: e.node.name,
							color: e.node.color ?? '#ccc',
							size: e.size,
							percentage: languages.totalSize > 0 ? e.size / languages.totalSize : 0,
						})),
					},
				},
				contributions: repo.contributions.nodes.map(pick),
			};
		});

	const data = {
		commitContributionsByRepository: flatten(
			commitContributionsByRepository,
			(n: IRawCommitNode) => n,
		),
		issueContributionsByRepository: flatten(issueContributionsByRepository, (n: IRawIssueNode) => {
			return { ...n.issue, labels: unwrapNodes(n.issue.labels) };
		}),
		pullRequestContributionsByRepository: flatten(
			pullRequestContributionsByRepository,
			(n: { pullRequest: IRawPullRequestNode }) => n.pullRequest,
		),
		totalCommitContributions,
		totalPullRequestContributions,
		totalIssueContributions,
		restrictedContributionsCount,
	};

	return json(data, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
