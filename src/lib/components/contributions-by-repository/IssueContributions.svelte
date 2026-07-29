<script lang="ts">
	import type { IContributionByRepository, IIssue } from '$lib/github';
	import { contributionTitle } from '$lib/util/string';
	import { countContributions } from '$lib/util/contributions';
	import ContributionContainer from '$lib/components/contributions-by-repository/ContributionContainer.svelte';
	import RepoName from '$lib/components/UI/contribution/RepoName.svelte';
	import TitleWithBadge from '$lib/components/UI/contribution/TitleWithBadge.svelte';

	let {
		repositories,
	}: {
		repositories: IContributionByRepository<IIssue>[];
	} = $props();

	const issuesCount = $derived(countContributions(repositories));
</script>

{#if repositories.length > 0}
	<ContributionContainer>
		<TitleWithBadge
			text={contributionTitle({
				action: 'Opened',
				count: issuesCount,
				noun: 'issue',
				repositoryCount: repositories.length,
			})}
		>
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
		</TitleWithBadge>
		{#each repositories as repo}
			<div class="container">
				<RepoName repo={repo.repository}></RepoName>
				<div class="issues-container">
					{#each repo.contributions as issue}
						<div class="issues">
							{#if issue.closed}
								<div class="issue-status closed">
									<svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="currentColor"
										><path
											d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm1.5 0a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm10.28-1.72-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l1.47 1.47 3.97-3.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"
										></path></svg
									>
								</div>
							{:else}
								<div class="issue-status open">
									<svg
										focusable="false"
										aria-label="Issue"
										role="img"
										viewBox="0 0 16 16"
										fill="currentColor"
										><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path
											d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"
										></path></svg
									>
								</div>
							{/if}
							<div class="issue">
								<a href={issue.url} target="_blank">
									{issue.title}
								</a>
								<div class="labels-container">
									{#each issue.labels as label}
										<div class="label" style="background-color: {`#${label.color}`}">
											{label.name}
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</ContributionContainer>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);

		.issues-container {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);
		}

		.issues {
			display: flex;
			align-items: center;
			gap: var(--space-1);

			.issue {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: var(--space-2);
				flex: 1;
			}

			.issue-status {
				display: flex;
				justify-content: center;
				align-items: center;

				width: 18px;
				height: 18px;
				background-color: #8957e5;
				border-radius: var(--radius-full);

				svg {
					width: 12px;
					height: 12px;
					color: white;
				}
			}

			.issue-status.closed {
				background-color: #8957e5;
			}

			.issue-status.open {
				background-color: #238636;
			}

			.labels-container {
				display: flex;
				gap: var(--space-1);

				.label {
					color: black;
					padding: 2px 4px;
					border-radius: var(--radius-md);
					font-size: var(--font-size-xs);
					text-overflow: ellipsis;
					box-shadow: var(--shadow);
					font-weight: var(--font-weight-normal);
				}
			}
		}
	}
</style>
