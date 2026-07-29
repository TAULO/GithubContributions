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
					<div class="link">
						<a
							class={repo.repository.primaryLanguage ? 'flex-end' : 'flex-start'}
							href={`${repo.repository.url}/commits?author=${user}&since=${date}&until=${date}`}
							target="_blank">{commits} {pluralize(commits, 'commit')}</a
						>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							id="Layer_1"
							viewBox="0 0 512 512"
							xml:space="preserve"
						>
							<polygon
								points="247.5,0 34.2,213.3 34.2,341.3 204.8,170.7 204.8,512 290.2,512 290.2,170.7 460.8,341.3 460.8,213.3 "
							/>
						</svg>
					</div>
				</div>
			{/each}
		</div>
	</ContributionContainer>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.item-container {
		display: flex;
		justify-content: space-between;
	}

	a.flex-end {
		align-self: flex-end;
	}

	a.flex-start {
		align-self: flex-start;
	}

	.link {
		color: var(--text-primary);

		svg {
			display: none;
			height: 0.5rem;
			rotate: 30deg;
			position: relative;
			top: -0.3rem;
			right: 0.1rem;
			color: var(--tertiary-color);
		}
	}
</style>
