import type { IContributionByRepository, ICommitNode } from '$lib/github';

export const nodesOf = <TNode>(repos: IContributionByRepository<TNode>[]): TNode[] =>
	repos.flatMap((r) => r.contributions.nodes);

export const sumCommits = (nodes: ICommitNode[]) =>
	nodes.reduce((acc, n) => acc + n.commitCount, 0);
