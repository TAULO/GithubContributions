<script lang="ts">
	import { type ContributionDay, type IContributionCollection } from '$lib/github';
	import { SvelteSet } from 'svelte/reactivity';
	import ContributionDayCell from '$lib/components/contribution-calendar/ContributionDayCell.svelte';

	let {
		contributionCollection,
		onSelectionChange,
	}: {
		contributionCollection: IContributionCollection;
		onSelectionChange?: (dates: string[]) => void;
	} = $props();

	const selectedContributionsDate = new SvelteSet<string>();

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

	const levelColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

	let contributions = $derived(contributionCollection.contributions);
	let hoveredMonth = $state<number | null>(null);

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

	function toggleSelected(contribution: ContributionDay) {
		if (contribution.count === 0) return;

		if (selectedContributionsDate.has(contribution.date)) {
			selectedContributionsDate.delete(contribution.date);
		} else {
			selectedContributionsDate.add(contribution.date);
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
			.flat() // weeks → all days
			.filter((day) => new Date(day.date).getUTCMonth() === monthIndex);

		for (const contributions of datesInMonth) toggleSelected(contributions);
	}

	$effect(() => {
		onSelectionChange?.(Array.from(selectedContributionsDate));
	});
</script>

<div class="container">
	{#each contributions as contribution, index}
		{@const label = getWeekDateFromIndex(index)}
		<div class="block">
			{#if label}
				<button
					class="date"
					onmouseenter={() => labelEnter(months.indexOf(label))}
					onmouseleave={labelLeave}
					onclick={() => labelClick(months.indexOf(label))}
				>
					{label}
				</button>
			{/if}
			{#each contribution as contributionDay}
				{@const isSelected = selectedContributionsDate.has(contributionDay.date)}
				{@const hasContributions = contributionDay.count > 0}
				{@const highlight =
					hoveredMonth !== null &&
					hoveredMonth === new Date(contributionDay.date).getUTCMonth() &&
					hasContributions}
				<ContributionDayCell
					{contributionDay}
					selected={isSelected}
					onToggleSelected={() => toggleSelected(contributionDay)}
					dimmed={selectedContributionsDate.size > 0 && !isSelected}
					highlighted={highlight}
					interactive={hasContributions}
					disabled={!hasContributions}
				/>
			{/each}
		</div>
	{/each}
</div>
<div class="display-cell-container">
	{#each levelColors as color}
		<div class="display-cell" style="background-color: {color}"></div>
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

	.block:first-child {
		align-self: flex-end;
	}

	.date {
		position: absolute;
		top: -24px;

		padding: 0;
		margin: 0;
	}

	.display-cell-container {
		display: flex;
		gap: 2px;
		margin-top: 16px;
		justify-content: end;

		.display-cell {
			width: 12px;
			height: 12px;
			padding: 0;
			border: none;
			border-radius: 2px;
			background: transparent;
		}
	}
</style>
