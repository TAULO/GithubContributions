<script lang="ts">
	import { type IContributionCollection } from '$lib/github';
	import ContributionDay from './ContributionDay.svelte';
	import { SvelteSet } from 'svelte/reactivity';

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

	let { contributionCollection }: { contributionCollection: IContributionCollection } = $props();
	let contributions = $derived(contributionCollection.contributions);
	let hasSelection = $derived(selectedContributionsDate.size > 0);

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
		if (selectedContributionsDate.has(contributionDate))
			selectedContributionsDate.delete(contributionDate);
		else selectedContributionsDate.add(contributionDate);
	}
</script>

<div class="container">
	{#each contributions as contribution, index}
		<div class="block">
			<p class="date">{getWeekDateFromIndex(index)}</p>
			{#each contribution as contributionDay}
				<ContributionDay
					{contributionDay}
					selected={selectedContributionsDate.has(contributionDay.date)}
					onToggleSelected={() => toggleSelected(contributionDay.date)}
					dimmed={hasSelection && !selectedContributionsDate.has(contributionDay.date)}
				/>
			{/each}
		</div>
	{/each}
</div>

<div>
	{#each selectedContributionsDate as date}
		<p>{date}</p>
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
</style>
