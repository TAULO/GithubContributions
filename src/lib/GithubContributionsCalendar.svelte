<script lang="ts">
	import type { ContributionDay, IContributionCollection } from '$lib/github';
	import { SvelteSet } from 'svelte/reactivity';

	const { contributionCollection }: { contributionCollection: IContributionCollection } = $props();
	const contributions = $derived(contributionCollection.contributions);

	const selectedContributions = new SvelteSet<string>();

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	function getWeekDateFromIndex(index: number): string | null {
		if (index === 0) return null; // skip the first month

		const monthStr = contributions[index]?.[0]?.date;
		if (!monthStr) return null;

		const currentMonthIndex = new Date(monthStr).getMonth();
		if (index === 0) return months[currentMonthIndex] ?? null;

		const prevMonthStr = contributions[index - 1]?.[0]?.date;
		if (!prevMonthStr) return months[currentMonthIndex] ?? null;

		const prevMonthIndex = new Date(prevMonthStr).getMonth();
		if (currentMonthIndex === prevMonthIndex) return null;

		return months[currentMonthIndex] ?? null;
	}

	function toggleSelected(contributionDate: string) {
		if (selectedContributions.has(contributionDate)) selectedContributions.delete(contributionDate);
		else selectedContributions.add(contributionDate);
	}
</script>

<div class="container">
	{#each contributions as contribution, index}
		<div class="block">
			<p class="date">{getWeekDateFromIndex(index)}</p>
			{#each contribution as contributionDay}
				<button
					class={[
						'cell',
						`level-${contributionDay.level}`,
						selectedContributions.has(contributionDay.date) && 'selected',
						selectedContributions.size > 0 &&
							!selectedContributions.has(contributionDay.date) &&
							'not-selected',
					]}
					style="--cell-color: var(--gh-level-{contributionDay.level}})"
					title={contributionDay.date}
					onclick={() => toggleSelected(contributionDay.date)}
				></button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		display: flex;
		gap: 2px;

		padding-top: 24px;
		overflow-x: auto;
	}

	.block {
		position: relative;

		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.date {
		position: absolute;
		top: -24px;

		padding: 0;
		margin: 0;
	}

	.cell {
		width: 12px;
		height: 12px;
		padding: 0;
		border: none;
		border-radius: 2px;
		cursor: pointer;
		background: transparent;
	}

	.cell.selected {
		border: 1px solid greenyellow;
	}

	.cell.not-selected {
		opacity: 0.3;
	}

	.cell:hover {
		cursor: pointer;
		border: 1px solid greenyellow;
	}

	.cell.level-0 {
		background-color: var(--gh-level-0, #ebedf0);
	}
	.cell.level-1 {
		background-color: var(--gh-level-1, #9be9a8);
	}
	.cell.level-2 {
		background-color: var(--gh-level-2, #40c463);
	}
	.cell.level-3 {
		background-color: var(--gh-level-3, #30a14e);
	}
	.cell.level-4 {
		background-color: var(--gh-level-4, #216e39);
	}
</style>
