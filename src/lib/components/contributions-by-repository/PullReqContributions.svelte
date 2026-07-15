<script lang="ts">
	import type { IContributionByRepository, IPullRequestNode } from '$lib/github';
	import { contributionTitle } from '$lib/util/string';
	import { nodesOf } from '$lib/util/contributions';

	let {
		dayContributions,
	}: {
		dayContributions: IContributionByRepository<IPullRequestNode>[];
	} = $props();

	const nodes = $derived(nodesOf(dayContributions));
	const nodesLen = $derived(nodes.length);
</script>

{#if nodes.length > 0}
	<div class="repositories-container">
		<div class="timeline"></div>
		<div class="repositories">
			<h3>
				{contributionTitle({
					action: 'Opened',
					count: nodesLen,
					noun: 'pull request',
					repositoryCount: dayContributions.length,
				})}
			</h3>
			{#each dayContributions as pullRequestContributions}
				<div class="repository-container">
					<a class="repository-name" href={pullRequestContributions.repository.url} target="_blank">
						{pullRequestContributions.repository.nameWithOwner}
					</a>
					{#each pullRequestContributions.contributions.nodes as pullRequest}
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

		.timeline {
			width: 2px;
			background-color: gray;
			margin: 0 8px;
		}
	}
</style>
