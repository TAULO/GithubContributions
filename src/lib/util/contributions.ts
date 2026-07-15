import type { ICommit, IContributionByRepository } from '$lib/github';

// sum the per-node commitCount (a node can be many commits)
export const countCommits = (commits: ICommit[]) =>
	commits.reduce((acc, c) => acc + c.commitCount, 0);

// each node is one contribution, so count nodes
export const countContributions = <T>(contributions: IContributionByRepository<T>[]) =>
	contributions.reduce((acc, c) => acc + c.contributions.length, 0);
