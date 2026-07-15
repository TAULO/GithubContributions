<script lang="ts">
	import type { IDayContributions } from '$lib/github';
	import { sumCommits } from '$lib/util/contributions';
	import IssueContributions from '$lib/components/contributions-by-repository/IssueContributions.svelte';
	import PullReqContributions from '$lib/components/contributions-by-repository/PullReqContributions.svelte';
	import { prettyDate } from '$lib/util/string';
	import CommitContributions from '$lib/components/contributions-by-repository/CommitContributions.svelte';

	let {
		selectedContributionsByRepository,
		user,
	}: { selectedContributionsByRepository: IDayContributions[]; user: string } = $props();

	const totalCommits = $derived(
		sumCommits(
			selectedContributionsByRepository.flatMap((day) =>
				day.commitContributionsByRepository.flatMap((repo) => repo.contributions),
			),
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
					<div class="timeline">
						{#if contributionByRepository.commitContributionsByRepository.length > 0}
							<div class="contribution-item">
								<div class="badge"></div>
								<CommitContributions
									dayContributions={contributionByRepository.commitContributionsByRepository}
									{user}
									date={contributionByRepository.date}
								/>
							</div>
						{/if}
						{#if contributionByRepository.issueContributionsByRepository.length > 0}
							<div class="contribution-item">
								<div class="badge"></div>
								<IssueContributions
									dayContributions={contributionByRepository.issueContributionsByRepository}
								/>
							</div>
						{/if}
						{#if contributionByRepository.pullRequestContributionsByRepository.length > 0}
							<div class="contribution-item">
								<div class="badge"></div>
								<PullReqContributions
									dayContributions={contributionByRepository.pullRequestContributionsByRepository}
								/>
							</div>
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

		padding: 1rem 0;
		margin-left: 0.7rem;
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

	.contribution-item {
		display: flex;

		.badge {
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 50%;
			background-color: #212830;
			position: relative;
			margin: -2px 8px 0 -13px;
			z-index: 1;
			/* Note: This is a hack to make the badge appear above the timeline, therefor the color must match the background color of the timeline */
			border: 0.125rem solid white;
		}
	}

	.no-activity {
		align-self: center;
		justify-self: center;
	}
</style>
