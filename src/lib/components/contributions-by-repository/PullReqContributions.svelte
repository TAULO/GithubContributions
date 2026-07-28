<script lang="ts">
	import { type IContributionByRepository, type IPullRequest, PullRequestState } from '$lib/github';
	import { contributionTitle } from '$lib/util/string';
	import { countContributions } from '$lib/util/contributions';
	import ContributionContainer from '$lib/components/contributions-by-repository/ContributionContainer.svelte';
	import RepoName from '$lib/components/UI/contribution/RepoName.svelte';
	import TitleWithBadge from '$lib/components/UI/contribution/TitleWithBadge.svelte';
	import type { Snippet } from 'svelte';

	let {
		repositories,
	}: {
		repositories: IContributionByRepository<IPullRequest>[];
	} = $props();

	const prCount = $derived(countContributions(repositories));
</script>

{#if repositories.length > 0}
	<ContributionContainer>
		<div>
			<TitleWithBadge
				text={contributionTitle({
					action: 'Opened',
					count: prCount,
					noun: 'pull request',
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
					<path
						d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
					></path>
				</svg>
			</TitleWithBadge>
			{#each repositories as repo}
				<div class="container">
					<RepoName repo={repo.repository}></RepoName>
					<div>
						{#each repo.contributions as pullRequest}
							<div class="pull-request-container">
								<a href={pullRequest.url} target="_blank">
									{pullRequest.title}
								</a>
								{#if pullRequest.state === PullRequestState.OPEN}
									<div class="pull-request-state open">
										<svg
											focusable="false"
											aria-label="Pull request"
											role="img"
											viewBox="0 0 16 16"
											width="16"
											height="16"
											fill="currentColor"
											overflow="visible"
											style="vertical-align:text-bottom"
											><path
												d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
											></path></svg
										>Open
									</div>
								{:else if pullRequest.state === PullRequestState.CLOSED}
									<div class="pull-request-state closed">
										<svg
											focusable="false"
											aria-label="Pull request"
											role="img"
											viewBox="0 0 16 16"
											width="16"
											height="16"
											fill="currentColor"
											overflow="visible"
											><path
												d="M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1Zm9.5 5.5a.75.75 0 0 1 .75.75v3.378a2.251 2.251 0 1 1-1.5 0V7.25a.75.75 0 0 1 .75-.75Zm-2.03-5.273a.75.75 0 0 1 1.06 0l.97.97.97-.97a.748.748 0 0 1 1.265.332.75.75 0 0 1-.205.729l-.97.97.97.97a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-.97-.97-.97.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l.97-.97-.97-.97a.75.75 0 0 1 0-1.06ZM2.5 3.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0ZM3.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm9.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
											></path></svg
										>
										Closed
									</div>
								{:else}
									<div class="pull-request-state merged">
										<svg
											focusable="false"
											aria-label="Pull request"
											role="img"
											viewBox="0 0 16 16"
											width="16"
											height="16"
											fill="currentColor"
											><path
												d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z"
											></path></svg
										>Merged
									</div>
								{/if}
							</div>
						{/each}
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
		gap: 16px;

		a {
			color: var(--text-primary);
		}

		a:hover {
			color: var(--hover-color);
		}

		.pull-request-container {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			justify-content: space-between;

			.pull-request-state {
				display: flex;
				align-items: center;
				gap: 0.25rem;
				width: fit-content;
				padding: 0.25rem 0.5rem;
				border-radius: 1rem;
				color: var(--text-on-accent);
				box-shadow: var(--shadow);
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 500;
			}

			.pull-request-state.open {
				background-color: #238636;
			}

			.pull-request-state.closed {
				background-color: #da3633;
			}

			.pull-request-state.merged {
				background-color: #8957e5;
			}
		}
	}
</style>
