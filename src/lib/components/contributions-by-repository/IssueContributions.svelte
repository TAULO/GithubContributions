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
							<div class={['issue-status', issue.closed ? 'issue-closed' : 'issue-open']}></div>
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
		gap: 16px;

		.issues-container {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.issues {
			display: flex;
			align-items: center;
			gap: 4px;

			.issue {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 8px;
				flex: 1;
			}

			.labels-container {
				display: flex;
				gap: 4px;

				.label {
					color: var(--primary-color);
					padding: 2px 4px;
					border-radius: 8px;
					font-size: 12px;
					text-overflow: ellipsis;
					box-shadow: var(--shadow);
				}
			}

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
</style>
