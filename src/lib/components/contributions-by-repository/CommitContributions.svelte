<script lang="ts">
	import type { IContributionByRepository, ICommit } from '$lib/github';
	import { contributionTitle, pluralize } from '$lib/util/string';
	import { countCommits } from '$lib/util/contributions';
	import ContributionContainer from '$lib/components/contributions-by-repository/ContributionContainer.svelte';
	import RepoName from '$lib/components/UI/contribution/RepoName.svelte';
	import TitleWithBadge from '$lib/components/UI/contribution/TitleWithBadge.svelte';

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

{#if repositories.length > 0}
	<ContributionContainer>
		<TitleWithBadge
			text={contributionTitle({
				action: 'Contributed',
				count: commits,
				noun: 'commit',
				repositoryCount: repositories.length,
			})}
		>
			<svg fill="currentColor" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
				<path
					d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"
				></path>
			</svg>
		</TitleWithBadge>
		<div class="container">
			{#each repositories as repo}
				{@const commits = countCommits(repo.contributions)}
				<div class="item-container">
					<RepoName repo={repo.repository}></RepoName>
					<a
						class={repo.repository.primaryLanguage ? 'flex-end' : 'flex-start'}
						href={`${repo.repository.url}/commits?author=${user}&since=${date}&until=${date}`}
						target="_blank">{commits} {pluralize(commits, 'commit')}</a
					>
				</div>
			{/each}
		</div>
	</ContributionContainer>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.item-container {
		display: flex;
		justify-content: space-between;
	}

	a {
		font-style: italic;
	}

	a.flex-end {
		align-self: flex-end;
	}

	a.flex-start {
		align-self: flex-start;
	}
</style>
