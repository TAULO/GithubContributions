<script lang="ts" xmlns="http://www.w3.org/1999/html">
	import type { IContributionByRepository, ICommit } from '$lib/github';
	import { contributionTitle, pluralize } from '$lib/util/string';
	import { countCommits } from '$lib/util/contributions';
	import Badge from '$lib/components/UI/contribution/Badge.svelte';
	import ContributionContainer from '$lib/components/contributions-by-repository/ContributionContainer.svelte';
	import Title from '$lib/components/UI/contribution/Title.svelte';
	import RepoName from '$lib/components/UI/contribution/RepoName.svelte';

	let {
		repositories,
		user,
		date,
	}: {
		repositories: IContributionByRepository<ICommit>[];
		user: string;
		date: string;
	} = $props();

	const commits = $derived(countCommits(repositories.flatMap((d) => d.contributions)));
</script>

<ContributionContainer>
	<Badge>
		<svg fill="currentColor" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
			<path
				d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"
			></path>
		</svg>
	</Badge>
	<div class="commits-container">
		<Title
			text={contributionTitle({
				action: 'Contributed',
				count: commits,
				noun: 'commit',
				repositoryCount: repositories.length,
			})}
		></Title>
		{#each repositories as repo}
			{@const commits = countCommits(repo.contributions)}
			<div>
				<RepoName repo={repo.repository}></RepoName>
				<p>
					<a
						href={`${repo.repository.url}/commits?author=${user}&since=${date}&until=${date}`}
						target="_blank">{commits} {pluralize(commits, 'commit')}</a
					>
				</p>
			</div>
		{/each}
	</div>
</ContributionContainer>

<style>
</style>
