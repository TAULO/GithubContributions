<script lang="ts">
	import { type IContributionCollection, type IDayContributions } from '$lib/github';
	import ContributionDay from './ContributionDay.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Contributions from '$lib/components/contributions-by-repository/Contributions.svelte';

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

	let sortedSelectedContributionsDate = $derived(
		Array.from(selectedContributionsDate).sort(
			(dateA, dateB) => new Date(dateB).getTime() - new Date(dateA).getTime(),
		),
	);

	let contributionsByRepository = $state<IDayContributions[]>([]);

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

	async function toggleSelected(contributionDate: string) {
		if (selectedContributionsDate.has(contributionDate))
			selectedContributionsDate.delete(contributionDate);
		else selectedContributionsDate.add(contributionDate);

		contributionsByRepository = await fetchSelectedContributions();
	}

	async function fetchSelectedContributions(): Promise<IDayContributions[]> {
		const data = [];
		for (const date of sortedSelectedContributionsDate) {
			const res = await fetch(`/api/contributions?user=TAULO&from=${date}`);
			if (!res.ok) continue; // or collect the error
			data.push({
				...(await res.json()),
				date,
			});
		}

		console.log(data);
		return data;
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

<Contributions {contributionsByRepository}></Contributions>

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
