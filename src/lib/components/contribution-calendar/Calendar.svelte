<script lang="ts">
	import type { ContributionDay, IContributionCollection } from '$lib/github';
	import { SvelteSet } from 'svelte/reactivity';
	import Cell from '$lib/components/contribution-calendar/Cell.svelte';

	let {
		contributionCollection,
		selectedContributionsDate,
		selectedYear,
	}: {
		contributionCollection: IContributionCollection;
		selectedContributionsDate: SvelteSet<string>;
		selectedYear: number | null;
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

	let hoveredMonth = $state<number | null>(null);
	let shiftHeld = $state(false);
	let isHoveringCalendar = $state(false);

	let contributions = $derived(contributionCollection.contributions);
	let previewingAll = $derived(shiftHeld && isHoveringCalendar);

	const isEligibleInMonth = (day: ContributionDay) =>
		new Date(day.date).getUTCMonth() === hoveredMonth &&
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

	function monthLabelEnter(monthIndex: number | null) {
		hoveredMonth = monthIndex;
	}

	function monthLabelLeaver() {
		hoveredMonth = null;
	}

	function monthLabelClick() {
		const datesInMonth = contributions
			.flat()
			.filter((day) => isEligibleInMonth(day))
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
		const ref = selectedYear ? new Date(selectedYear, 0, 1) : new Date();
		const d = new Date(date);
		return d.getUTCFullYear() === ref.getUTCFullYear() - 1 && d.getUTCMonth() === ref.getUTCMonth();
	}

	function selectAllContributions() {
		const allContributions = contributions
			.flat()
			.filter((day) => day.count > 0)
			.map((day) => day.date);

		const allSelected = allContributions.every((date) => selectedContributionsDate.has(date));

		for (const date of allContributions) {
			if (allSelected) {
				selectedContributionsDate.delete(date);
			} else {
				selectedContributionsDate.add(date);
			}
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key.toLowerCase() === 'shift') {
			shiftHeld = true;
		}

		if (shiftHeld && isHoveringCalendar) {
			console.log(e.key.toLowerCase());
			switch (e.key.toLowerCase()) {
				case 'a':
					selectAllContributions();
					break;
				case 'backspace':
					selectedContributionsDate.clear();
					break;
			}
		}
	}
	function onKeyUp(e: KeyboardEvent) {
		if (e.key === 'Shift') {
			shiftHeld = false;
		}
	}
</script>

<div
	class="contributions-calendar"
	onmouseenter={() => (isHoveringCalendar = true)}
	onmouseleave={() => (isHoveringCalendar = false)}
	role="table"
>
	{#each contributions as contribution, index}
		{@const label = getWeekDateFromIndex(index)}
		<div class="block">
			{#if label}
				<div class="date-container">
					<button
						onmouseenter={() => monthLabelEnter(months.indexOf(label))}
						onmouseleave={monthLabelLeaver}
						onclick={monthLabelClick}
					>
						{label}
					</button>
				</div>
			{/if}
			{#each contribution as contributionDay}
				{@const isSelected = selectedContributionsDate.has(contributionDay.date)}
				{@const hasContributions = contributionDay.count > 0}
				{@const highlightMonth = hoveredMonth !== null && isEligibleInMonth(contributionDay)}
				{@const highlightAll = hasContributions && previewingAll}
				<Cell
					{contributionDay}
					selected={isSelected}
					onToggleSelected={() => {
						if (!previewingAll) toggleSelected(contributionDay.date);
					}}
					dimmed={selectedContributionsDate.size > 0 && !isSelected}
					highlighted={highlightMonth || highlightAll}
					interactive={hasContributions}
					disabled={!hasContributions}
				/>
			{/each}
		</div>
	{/each}
</div>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} />

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
