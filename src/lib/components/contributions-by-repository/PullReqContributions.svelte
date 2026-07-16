<script lang="ts">
	import type { IContributionByRepository, IPullRequest } from '$lib/github';
	import { contributionTitle } from '$lib/util/string';
	import Badge from '$lib/components/UI/contribution/Badge.svelte';
	import { countContributions } from '$lib/util/contributions';
	import ContributionContainer from '$lib/components/contributions-by-repository/ContributionContainer.svelte';
	import Title from '$lib/components/UI/contribution/Title.svelte';
	import RepoName from '$lib/components/UI/contribution/RepoName.svelte';

	let {
		repositories,
	}: {
		repositories: IContributionByRepository<IPullRequest>[];
	} = $props();

	const prCount = $derived(countContributions(repositories));
</script>

<ContributionContainer>
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
		<Title
			text={contributionTitle({
				action: 'Opened',
				count: prCount,
				noun: 'pull request',
				repositoryCount: repositories.length,
			})}
		></Title>
		{#each repositories as repo}
			<div class="repository-container">
				<RepoName repo={repo.repository}></RepoName>
				<div class="pull-requests-container">
					{#each repo.contributions as pullRequest}
						<div class="pull-request">
							<a href={pullRequest.url} target="_blank">
								{pullRequest.title}
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</ContributionContainer>

<style>
	.pull-requests-container {
		display: flex;
		flex-direction: column;
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
</style>
