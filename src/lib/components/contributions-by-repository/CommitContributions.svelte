<script lang="ts">
	import type { IContributionByRepository, ICommit } from '$lib/github';
	import { contributionTitle, pluralize } from '$lib/util/string';
	import { countCommits } from '$lib/util/contributions';
	import Badge from '$lib/components/UI/Badge.svelte';

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

{#if commits > 0}
	<div class="repositories-container">
		<Badge>
			<svg fill="currentColor" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
				<path
					d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"
				></path>
			</svg>
		</Badge>
		<div class="repositories">
			<h3>
				{contributionTitle({
					action: 'Contributed',
					count: commits,
					noun: 'commit',
					repositoryCount: repositories.length,
				})}
			</h3>
			{#each repositories as repo}
				{@const commits = countCommits(repo.contributions)}
				<div class="repository-container">
					<a class="repository-name" href={repo.repository.url} target="_blank">
						{repo.repository.nameWithOwner}
					</a>
					<p>
						<a
							class="repository-commits"
							href={`${repo.repository.url}/commits?author=${user}&since=${date}&until=${date}`}
							target="_blank">{commits} {pluralize(commits, 'commit')}</a
						>
					</p>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	p {
		margin: 0;
		padding: 0;
	}

	.repository-container {
		display: flex;
		gap: 8px;
		justify-content: space-between;

		a {
			text-decoration: none;
		}

		a:hover {
			text-decoration: underline;
		}

		.repository-name {
			font-size: 16px;
		}

		.repository-commits {
			font-size: 14px;
		}
	}

	.repositories-container {
		display: flex;
		gap: 8px;
		flex: 1;

		.repositories {
			display: flex;
			flex-direction: column;
			gap: 4px;
			flex: 1;

			h3 {
				margin: 0;
			}
		}
	}
</style>
