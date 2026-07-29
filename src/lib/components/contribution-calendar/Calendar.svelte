<script lang="ts">
	import type { ContributionDay, IContributionCollection } from '$lib/github';
	import { SvelteSet } from 'svelte/reactivity';
	import Cell from '$lib/components/contribution-calendar/Cell.svelte';

	let {
		contributionCollection,
		selectedContributionsDate,
	}: {
		contributionCollection: IContributionCollection;
		selectedContributionsDate: SvelteSet<string>;
	} = $props();

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

	let contributions = $derived(contributionCollection.contributions);
	let hoveredMonth = $state<number | null>(null);

	const isEligibleInMonth = (day: ContributionDay, monthIndex: number) =>
		new Date(day.date).getUTCMonth() === monthIndex &&
		day.count > 0 &&
		!isTodayUtcMonthLastYear(day.date);

	function getWeekDateFromIndex(index: number): string | null {
		if (index === 0) return null; // skip the first month

		const monthStr = contributions[index]?.[0]?.date;
		if (!monthStr) return null;

		const currentMonthIndex = new Date(monthStr).getUTCMonth();

		const prevMonthStr = contributions[index - 1]?.[0]?.date;
		if (!prevMonthStr) return months[currentMonthIndex] ?? null;

		const prevMonthIndex = new Date(prevMonthStr).getUTCMonth();
		if (currentMonthIndex === prevMonthIndex) return null;

		return months[currentMonthIndex] ?? null;
	}

	function toggleSelected(date: string) {
		if (selectedContributionsDate.has(date)) {
			selectedContributionsDate.delete(date);
		} else {
			selectedContributionsDate.add(date);
		}
	}

	function labelEnter(monthIndex: number | null) {
		hoveredMonth = monthIndex;
	}

	function labelLeave() {
		hoveredMonth = null;
	}

	function labelClick(monthIndex: number) {
		const datesInMonth = contributions
			.flat()
			.filter((day) => isEligibleInMonth(day, monthIndex))
			.map((day) => day.date);

		const allSelected = datesInMonth.every((date) => selectedContributionsDate.has(date));

		for (const date of datesInMonth) {
			if (allSelected) {
				selectedContributionsDate.delete(date);
			} else {
				selectedContributionsDate.add(date);
			}
		}
	}

	function isTodayUtcMonthLastYear(date: string) {
		const today = new Date();

		return (
			new Date(date).getUTCFullYear() === today.getUTCFullYear() - 1 &&
			new Date(date).getUTCMonth() === today.getUTCMonth()
		);
	}
</script>

<div class="contributions-calendar">
	{#each contributions as contribution, index}
		{@const label = getWeekDateFromIndex(index)}
		<div class="block">
			{#if label}
				<div class="date-container">
					<button
						onmouseenter={() => labelEnter(months.indexOf(label))}
						onmouseleave={labelLeave}
						onclick={() => labelClick(months.indexOf(label))}
					>
						{label}
					</button>
				</div>
			{/if}
			{#each contribution as contributionDay}
				{@const isSelected = selectedContributionsDate.has(contributionDay.date)}
				{@const hasContributions = contributionDay.count > 0}
				{@const highlight =
					hoveredMonth !== null && isEligibleInMonth(contributionDay, hoveredMonth)}
				<Cell
					{contributionDay}
					selected={isSelected}
					onToggleSelected={() => toggleSelected(contributionDay.date)}
					dimmed={selectedContributionsDate.size > 0 && !isSelected}
					highlighted={highlight}
					interactive={hasContributions}
					disabled={!hasContributions}
				/>
			{/each}
		</div>
	{/each}
</div>

<style>
	.contributions-calendar {
		display: flex;
		gap: 2px;

		padding-top: 24px;
		overflow-x: auto;

		align-items: center;
		justify-content: center;
	}

	.block {
		position: relative;

		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.block:first-child {
		align-self: flex-end;
	}

	.block:last-child {
		align-self: flex-start;
	}

	.date-container {
		position: absolute;
		top: -24px;

		button {
			margin: 0;
			padding: 0;
			background: none;
			border: none;
			font-weight: var(--font-weight-normal);
			color: var(--text-secondary);
		}

		button:hover {
			cursor: pointer;
			color: var(--hover-color);
		}
	}
</style>
