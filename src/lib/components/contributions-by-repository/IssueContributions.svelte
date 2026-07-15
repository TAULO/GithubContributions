<script lang="ts">
	import type { IContributionByRepository, IIssue } from '$lib/github';
	import { contributionTitle } from '$lib/util/string';
	import Badge from '$lib/components/UI/Badge.svelte';

	let {
		dayContributions,
	}: {
		dayContributions: IContributionByRepository<IIssue>[];
	} = $props();

	const nodes = $derived(dayContributions);
	const nodesLen = $derived(nodes.length);
</script>

{#if nodesLen > 0}
	<div class="issue-container">
		<Badge>
			<svg
				fill="currentColor"
				aria-hidden="true"
				height="16"
				viewBox="0 0 16 16"
				width="16"
				data-view-component="true"
			>
				<path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path
					d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"
				></path>
			</svg>
		</Badge>
		<div>
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
					{#each issueContribution.contributions as issue}
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
		gap: 8px;

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
