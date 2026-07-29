<script lang="ts">
	import {
		getContributionsCalendar,
		getDayContributions,
		type IContributionCollection,
		type IDayContributions,
	} from '$lib/github';
	import { SvelteSet } from 'svelte/reactivity';
	import ContributionsYear from '$lib/components/contribution-years/ContributionYears.svelte';
	import Calendar from '$lib/components/contribution-calendar/Calendar.svelte';
	import Levels from '$lib/components/contribution-calendar/Levels.svelte';
	import Contributions from '$lib/components/contributions-by-repository/Contributions.svelte';
	import { settings } from '$lib/services/settings/settings.svelte.js';

	let {
		contributionCollection,
		user,
	}: {
		contributionCollection: IContributionCollection;
		user: string;
	} = $props();

	const selectedContributionsDate = new SvelteSet<string>();

	let currentYear = $state<number | null>(null);

	let loading = $state(false);
	let errorMsg = $state<string | null>(null);

	let selectedContributionsByRepository = $state<IDayContributions[]>([]);

	async function handleSelectionChange(dates: string[]) {
		const timer = setTimeout(() => {
			loading = true;
		}, 200);
		try {
			const sorted = [...dates].sort((a, b) => a.localeCompare(b)).reverse();
			selectedContributionsByRepository = await getDayContributions(user.trim(), sorted);
		} catch (e) {
			console.error(e);
		} finally {
			clearTimeout(timer);
			loading = false;
		}
	}

	async function handleFetch() {
		errorMsg = null;
		try {
			const result = await getContributionsCalendar(user.trim(), currentYear);
			contributionCollection = result.contribution;
			user = result.user;
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Something went wrong';
		}
	}

	function changeYear(year: number) {
		if (currentYear && currentYear === year) {
			currentYear = null;
			handleFetch();
		} else {
			currentYear = year;
			handleFetch();
		}
	}

	function deleteByDate(date: string) {
		selectedContributionsDate.delete(date);
		selectedContributionsByRepository = selectedContributionsByRepository.filter(
			(c) => c.date !== date,
		);
	}

	$effect(() => {
		handleSelectionChange(Array.from(selectedContributionsDate));
	});
</script>

<div
	class="contributions-calendar-container"
	style={Object.entries(settings)
		.map(([k, v]) => `${k}: ${v}`)
		.join('; ')}
>
	<Calendar {contributionCollection} {selectedContributionsDate} />
	<Levels />
	<ContributionsYear
		contributionYears={contributionCollection.contributionYears}
		onClicked={changeYear}
		selectedYear={currentYear}
	/>
	<Contributions
		{selectedContributionsByRepository}
		{user}
		onDeleteByDate={deleteByDate}
		isLoading={loading}
	/>
	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}
</div>

<style>
	.contributions-calendar-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
</style>
