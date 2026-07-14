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
      	commitContributionsByRepository {
        	repository { nameWithOwner url }
        	contributions(first: 10) {
          	nodes { commitCount occurredAt }
        	}
      	}
      	pullRequestContributionsByRepository(maxRepositories: 10) {
        	repository { nameWithOwner }
        	contributions(first: 10) {
          	nodes { pullRequest { title url createdAt } }
        	}
      	}
      	issueContributionsByRepository(maxRepositories: 10) {
        	repository { nameWithOwner }
        	contributions(first: 10) {
          	nodes { issue { title url createdAt } }
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

export interface IContributionNode {
	commitCount: number;
	occurredAt: string;
}

export interface IContributionByRepository {
	repository: {
		nameWithOwner: string;
		url: string;
	};
	contributions: {
		nodes: IContributionNode[];
	};
}

export interface IDayContributions {
	date: string;
	commitContributionsByRepository: IContributionByRepository[];
}

export async function getContributions(
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
