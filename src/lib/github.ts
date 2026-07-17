export const CONTRIBUTION_CALENDAR_QUERY = `
  query($user: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $user) {
      contributionsCollection(from: $from, to: $to) {
      contributionYears
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }`;

export const CONTRIBUTION_QUERY = `
	query($user: String!, $from: DateTime!, $to: DateTime!) {
  	user(login: $user) {
    	contributionsCollection(from: $from, to: $to) {
      	totalCommitContributions
      	totalPullRequestContributions
      	totalIssueContributions
      	restrictedContributionsCount
      	commitContributionsByRepository {
        	repository { nameWithOwner url primaryLanguage { name color } languages(first: 10) { totalCount totalSize nodes { name color } } }
        	contributions(first: 10) {
          	nodes { commitCount occurredAt }
        	}
      	}
      	pullRequestContributionsByRepository(maxRepositories: 10) {
        	repository { nameWithOwner url primaryLanguage { name color } languages(first: 10) { totalCount totalSize nodes { name color } } }
        	contributions(first: 10) {
          	nodes { pullRequest { title url createdAt } }
        	}
      	}
			issueContributionsByRepository(maxRepositories: 10) {
				repository { nameWithOwner url primaryLanguage { name color } languages(first: 10) { totalCount totalSize nodes { name color } } }
				contributions(first: 10) {
					nodes {
						issue {
							title
							url
							createdAt
							closed
							labels(first: 10) {
								nodes { name color }
							}
						}
					}
				}
			}
    }
  }
}
`;

export const LEVELS = {
	NONE: 0,
	FIRST_QUARTILE: 1,
	SECOND_QUARTILE: 2,
	THIRD_QUARTILE: 3,
	FOURTH_QUARTILE: 4,
} as const;

export type Effects = 'wave' | 'ripple' | 'starlight';
export type EffectsOptions = {
	speed: number;
	opacity: number;
	color: string;
};

export type Theme = 'light' | 'dark';

export type ContributionLevel = keyof typeof LEVELS;
export type ContributionDay = { date: string; count: number; level: ContributionLevel };
export interface IContributionCollection {
	total: number;
	contributions: ContributionDay[][];
	contributionYears: number[];
}

export interface ICommit {
	commitCount: number;
	occurredAt: string;
}

export interface IPullRequest {
	title: string;
	url: string;
	createdAt: string;
}

export interface IIssue {
	title: string;
	url: string;
	createdAt: string;
	closed: boolean;
	labels: { name: string; color: string }[];
}

export interface ILanguage {
	name: string;
	color: string;
}

export interface ILanguageCollection {
	totalCount: number;
	totalSize: number;
	items: ILanguage[];
}

export interface IRepository {
	nameWithOwner: string;
	url: string;
	primaryLanguage: ILanguage | null;
	languages: ILanguageCollection;
}

export interface IContributionByRepository<TContribution> {
	repository: IRepository;
	contributions: TContribution[];
}

export interface IDayContributions {
	date: string;
	totalCommitContributions: number;
	totalPullRequestContributions: number;
	totalIssueContributions: number;
	restrictedContributionsCount: number;
	commitContributionsByRepository: IContributionByRepository<ICommit>[];
	pullRequestContributionsByRepository: IContributionByRepository<IPullRequest>[];
	issueContributionsByRepository: IContributionByRepository<IIssue>[];
}

export async function getContributionsCalendar(
	user: string,
	year?: number | string | null,
	fetchFn: typeof fetch = fetch,
) {
	let endpoint = `/api/contributions-calendar?user=${encodeURIComponent(user)}`;
	if (year) endpoint += `&year=${year}`;

	const res = await fetchFn(endpoint);
	if (!res.ok) {
		const { message } = await res.json().catch(() => ({ message: 'Failed to load' }));
		throw new Error(message);
	}

	const contribution: IContributionCollection = await res.json();

	return { user, contribution };
}

export async function getDayContributions(
	user: string,
	dates: string[],
	fetchFn: typeof fetch = fetch,
): Promise<IDayContributions[]> {
	const results = await Promise.all(
		dates.map(async (date) => {
			const res = await fetchFn(`/api/contributions?user=${encodeURIComponent(user)}&from=${date}`);
			if (!res.ok) return []; // skip failed days
			return regroupByDay(await res.json(), date); // same shape as the range path
		}),
	);

	return results.flat();
}

function groupReposByDay<T>(
	repos: IContributionByRepository<T>[],
	dateOf: (node: T) => string,
): Map<string, IContributionByRepository<T>[]> {
	// day -> (repoKey -> repo entry with that day's nodes)
	const byDay = new Map<string, Map<string, IContributionByRepository<T>>>();

	for (const repo of repos) {
		for (const node of repo.contributions) {
			const day = dateOf(node).slice(0, 10); // "2026-04-13T07:00:00Z" -> "2026-04-13"

			let repoMap = byDay.get(day);
			if (!repoMap) byDay.set(day, (repoMap = new Map()));

			const key = repo.repository.nameWithOwner;
			let entry = repoMap.get(key);
			if (!entry) repoMap.set(key, (entry = { repository: repo.repository, contributions: [] }));

			entry.contributions.push(node);
		}
	}

	// collapse the inner repo-maps into arrays
	const out = new Map<string, IContributionByRepository<T>[]>();
	for (const [day, repoMap] of byDay) out.set(day, [...repoMap.values()]);
	return out;
}

function regroupByDay(
	payload: {
		commitContributionsByRepository: IContributionByRepository<ICommit>[];
		issueContributionsByRepository: IContributionByRepository<IIssue>[];
		pullRequestContributionsByRepository: IContributionByRepository<IPullRequest>[];
		totalCommitContributions: number;
		totalPullRequestContributions: number;
		totalIssueContributions: number;
		restrictedContributionsCount: number;
	},
	from: string,
): IDayContributions[] {
	const commits = groupReposByDay(payload.commitContributionsByRepository, (n) => n.occurredAt);
	const issues = groupReposByDay(payload.issueContributionsByRepository, (n) => n.createdAt);
	const prs = groupReposByDay(payload.pullRequestContributionsByRepository, (n) => n.createdAt);

	const dayKeys = new Set([...commits.keys(), ...issues.keys(), ...prs.keys()]);

	const summary = {
		totalCommitContributions: payload.totalCommitContributions,
		totalPullRequestContributions: payload.totalPullRequestContributions,
		totalIssueContributions: payload.totalIssueContributions,
		restrictedContributionsCount: payload.restrictedContributionsCount,
	};

	if (dayKeys.size === 0) {
		return [
			{
				date: from,
				commitContributionsByRepository: [],
				issueContributionsByRepository: [],
				pullRequestContributionsByRepository: [],
				...summary,
			},
		];
	}

	return [...dayKeys]
		.sort((a, b) => b.localeCompare(a))
		.map((date) => ({
			date,
			commitContributionsByRepository: commits.get(date) ?? [],
			issueContributionsByRepository: issues.get(date) ?? [],
			pullRequestContributionsByRepository: prs.get(date) ?? [],
			...summary,
		}));
}
