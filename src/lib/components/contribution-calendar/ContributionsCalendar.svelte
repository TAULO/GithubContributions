<script lang="ts">
	import { type IContributionCollection } from '$lib/github';
	import { SvelteSet } from 'svelte/reactivity';
	import ContributionDay from '$lib/components/contribution-calendar/ContributionDay.svelte';

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

		const currentMonthIndex = new Date(monthStr).getMonth();

		const prevMonthStr = contributions[index - 1]?.[0]?.date;
		if (!prevMonthStr) return months[currentMonthIndex] ?? null;

		const prevMonthIndex = new Date(prevMonthStr).getMonth();
		if (currentMonthIndex === prevMonthIndex) return null;

		return months[currentMonthIndex] ?? null;
	}

	function toggleSelected(contributionDate: string) {
		if (selectedContributionsDate.has(contributionDate))
			selectedContributionsDate.delete(contributionDate);
		else selectedContributionsDate.add(contributionDate);

		// onSelectionChange?.(Array.from(selectedContributionsDate));
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
			.filter((day) => new Date(day.date).getUTCMonth() === monthIndex)
			.map((day) => day.date);

		const first = datesInMonth.shift();
		const last = datesInMonth.pop();

		for (const date of datesInMonth) toggleSelected(date);

		// onSelectionChange?.(Array.from(selectedContributionsDate));
	}
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
				{@const highlight =
					hoveredMonth !== null && hoveredMonth === new Date(contributionDay.date).getUTCMonth()}
				<ContributionDay
					{contributionDay}
					selected={isSelected}
					onToggleSelected={() => toggleSelected(contributionDay.date)}
					dimmed={selectedContributionsDate.size > 0 && !isSelected}
					highlighted={highlight}
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
