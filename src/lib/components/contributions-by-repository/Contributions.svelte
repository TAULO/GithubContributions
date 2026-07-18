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
		onDeleteByDate = (date: string) => {},
	}: {
		selectedContributionsByRepository: IDayContributions[];
		user: string;
		onDeleteByDate?: (date: string) => void;
	} = $props();

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
		{#each selectedContributionsByRepository as contributionByRepository}
			<div
				role="region"
				class="contribution-container"
			>
				<button
					class="delete-button"
					type="button"
					onclick={() => onDeleteByDate?.(contributionByRepository.date)}
					aria-label="Delete"
				>
					<svg fill="currentColor" aria-hidden="true" height="16" width="16" viewBox="0 0 16 16">
						<path
							d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
						/>
					</svg>
				</button>
				<div class="date-container">
					<p>{prettyDate(contributionByRepository.date)}</p>
					<div class="line"></div>
				</div>
				{#if !dayHasActivity(contributionByRepository)}
					{@render noContribution()}
				{:else}
					<div class="timeline">
						<CommitContributions
							repositories={contributionByRepository.commitContributionsByRepository}
							{user}
							date={contributionByRepository.date}
						/>
						<IssueContributions
							repositories={contributionByRepository.issueContributionsByRepository}
						/>
						<PullReqContributions
							repositories={contributionByRepository.pullRequestContributionsByRepository}
						/>
						<RestrictedContributions
							count={contributionByRepository.restrictedContributionsCount}
						/>
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
			background-color: var(--secondary-color);
			height: 2px;
		}

		p {
			font-size: 14px;
			font-weight: 500;
			color: var(--sub-title-color);
		}
	}

	.contribution-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		position: relative;

		.delete-button {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 1.5rem;
			right: 0;
			background-color: var(--secondary-color);
			border: none;
			color: var(--sub-title-color);
			cursor: pointer;
			padding: 0.2rem;
			z-index: 1;
			border-radius: 50%;
			box-shadow: var(--shadow);
		}

		.delete-button:hover {
			background-color: var(--hover-color);
		}
	}

	.timeline {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		padding: 1rem 0;
		margin-left: 1rem;
	}

	.timeline:before {
		width: 2px;
		content: '';
		background-color: var(--secondary-color);
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
