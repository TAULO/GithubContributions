<script lang="ts">
	import type { IContributionByRepository, IIssueNode } from '$lib/github';
	import { contributionTitle } from '$lib/util/string';
	import { nodesOf } from '$lib/util/contributions';

	let {
		dayContributions,
	}: {
		dayContributions: IContributionByRepository<IIssueNode>[];
	} = $props();

	const nodes = $derived(nodesOf(dayContributions));
	const nodesLen = $derived(nodes.length);
</script>

{#if nodesLen > 0}
	<div class="issue-container">
		<h3>
			{contributionTitle({
				action: 'Opened',
				count: nodesLen,
				noun: 'issue',
				repositoryCount: dayContributions.length,
			})}
		</h3>
		{#each dayContributions as issueContribution}
			<div class="issues">
				<a href={issueContribution.repository.url} target="_blank">
					{issueContribution.repository.nameWithOwner}
				</a>
				{#each issueContribution.contributions.nodes as issue}
					<div class="issue">
						<div class={['issue-status', issue.closed ? 'issue-closed' : 'issue-open']}></div>
						<a href={issue.url} target="_blank">
							{issue.title}
						</a>
					</div>
				{/each}
			</div>
		{/each}
	</div>
{/if}

<style>
	h3 {
		margin: 0;
		padding: 0;
	}

	p {
		margin: 0;
		padding: 0;
	}

	.issue-container {
		display: flex;
		flex-direction: column;

		.issues {
			display: flex;
			flex-direction: column;
			gap: 8px;

			.issue {
				display: flex;
				align-items: center;
				gap: 4px;

				.issue-status {
					width: 8px;
					height: 8px;
					border-radius: 50%;
				}

				.issue-closed {
					background-color: red;
				}

				.issue-open {
					background-color: green;
				}
			}
		}
	}
</style>
