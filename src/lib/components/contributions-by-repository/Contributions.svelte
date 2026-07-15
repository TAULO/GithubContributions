<script lang="ts">
	import type { IDayContributions } from '$lib/github';
	import IssueContributions from '$lib/components/contributions-by-repository/IssueContributions.svelte';
	import PullReqContributions from '$lib/components/contributions-by-repository/PullReqContributions.svelte';
	import { prettyDate } from '$lib/util/string';
	import CommitContributions from '$lib/components/contributions-by-repository/CommitContributions.svelte';
	import RestrictedContributions from '$lib/components/contributions-by-repository/RestrictedContributions.svelte';

	let {
		selectedContributionsByRepository,
		user,
	}: { selectedContributionsByRepository: IDayContributions[]; user: string } = $props();

	const totalCommits = $derived(
		selectedContributionsByRepository.reduce((acc, r) => acc + r.totalCommitContributions, 0),
	);

	const totalRestrictedContributions = $derived(
		selectedContributionsByRepository.reduce((acc, r) => acc + r.restrictedContributionsCount, 0),
	);

	const dayHasActivity = (day: IDayContributions) =>
		day.commitContributionsByRepository.length > 0 ||
		day.pullRequestContributionsByRepository.length > 0 ||
		day.issueContributionsByRepository.length > 0 ||
		day.restrictedContributionsCount > 0;

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
					<div class="timeline">
						{#if contributionByRepository.commitContributionsByRepository.length > 0}
							<CommitContributions
								dayContributions={contributionByRepository.commitContributionsByRepository}
								{user}
								date={contributionByRepository.date}
							/>
						{/if}
						{#if contributionByRepository.issueContributionsByRepository.length > 0}
							<IssueContributions
								dayContributions={contributionByRepository.issueContributionsByRepository}
							/>
						{/if}
						{#if contributionByRepository.pullRequestContributionsByRepository.length > 0}
							<PullReqContributions
								dayContributions={contributionByRepository.pullRequestContributionsByRepository}
							/>
						{/if}
						{#if totalRestrictedContributions > 0}
							<RestrictedContributions count={totalRestrictedContributions} />
						{/if}
					</div>
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

	.timeline {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		padding: 1.5rem 0;
		margin-left: 1rem;
	}

	.timeline:before {
		width: 2px;
		content: '';
		background-color: #3d444db3;
		display: block;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
	}

	.no-activity {
		align-self: center;
		justify-self: center;
	}
</style>
