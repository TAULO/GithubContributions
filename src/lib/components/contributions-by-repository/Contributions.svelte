<script lang="ts">
	import type { IDayContributions } from '$lib/github';
	import { nodesOf, sumCommits } from '$lib/util/contributions';
	import CommitNode from '$lib/components/contributions-by-repository/CommitContributions.svelte';
	import IssueContributions from '$lib/components/contributions-by-repository/IssueContributions.svelte';
	import PullReqContributions from '$lib/components/contributions-by-repository/PullReqContributions.svelte';
	import { prettyDate } from '$lib/util/string';

	let {
		selectedContributionsByRepository,
		user,
	}: { selectedContributionsByRepository: IDayContributions[]; user: string } = $props();

	let totalCommits = $derived(
		sumCommits(
			nodesOf(selectedContributionsByRepository.flatMap((d) => d.commitContributionsByRepository)),
		),
	);

	const dayHasActivity = (day: IDayContributions) =>
		day.commitContributionsByRepository.length > 0 ||
		day.pullRequestContributionsByRepository.length > 0 ||
		day.issueContributionsByRepository.length > 0;

	const hasContributions = $derived(selectedContributionsByRepository.some(dayHasActivity));
</script>

{#snippet noContribution()}
	<p class="no-activity">{user} had no contributions during this period.</p>
{/snippet}

<div class="container">
	{#if !hasContributions}
		{@render noContribution()}
	{:else}
		<p>{totalCommits}</p>
		{#each selectedContributionsByRepository as contributionByRepository}
			<div class="contribution-container">
				<div class="date-container">
					<p>{prettyDate(contributionByRepository.date)}</p>
					<div class="line"></div>
				</div>
				{#if !dayHasActivity(contributionByRepository)}
					{@render noContribution()}
				{:else}
					<CommitNode
						dayContributions={contributionByRepository.commitContributionsByRepository}
						{user}
						date={contributionByRepository.date}
					/>
					<IssueContributions
						dayContributions={contributionByRepository.issueContributionsByRepository}
					></IssueContributions>
					<PullReqContributions
						dayContributions={contributionByRepository.pullRequestContributionsByRepository}
					></PullReqContributions>
				{/if}
			</div>
		{/each}
	{/if}
</div>

<style>
	p {
		margin: 0;
		padding: 0;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.date-container {
		display: flex;
		align-items: center;
		gap: 16px;

		.line {
			flex: 1;
			background-color: gray;
			height: 1px;
		}
	}

	.contribution-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.no-activity {
		align-self: center;
		justify-self: center;
	}
</style>
