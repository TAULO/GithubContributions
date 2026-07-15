<script lang="ts">
	import type { IContributionByRepository, IPullRequest } from '$lib/github';
	import { contributionTitle } from '$lib/util/string';
	import Badge from '$lib/components/UI/Badge.svelte';
	import { countContributions } from '$lib/util/contributions';

	let {
		repositories,
	}: {
		repositories: IContributionByRepository<IPullRequest>[];
	} = $props();

	const prCount = $derived(countContributions(repositories));
</script>

<div class="repositories-container">
	<Badge>
		<svg
			fill="currentColor"
			aria-hidden="true"
			height="16"
			viewBox="0 0 16 16"
			width="16"
			data-view-component="true"
		>
			<path
				d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
			></path>
		</svg>
	</Badge>
	<div class="repositories">
		<h3>
			{contributionTitle({
				action: 'Opened',
				count: prCount,
				noun: 'pull request',
				repositoryCount: repositories.length,
			})}
		</h3>
		{#each repositories as repo}
			<div class="repository-container">
				<a class="repository-name" href={repo.repository.url} target="_blank">
					{repo.repository.nameWithOwner}
				</a>
				{#each repo.contributions as pullRequest}
					<div>
						<a href={pullRequest.url} target="_blank">
							{pullRequest.title}
						</a>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

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
	}

	.repositories-container {
		display: flex;
		gap: 8px;

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
