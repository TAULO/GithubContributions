import type { ICommit } from '$lib/github';

export const sumCommits = (commits: ICommit[]) =>
	commits.reduce((acc, c) => acc + c.commitCount, 0);
