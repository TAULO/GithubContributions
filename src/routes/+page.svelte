<script lang="ts">
	import type { PageData } from './$types';
	import {
		getContributionsCalendar,
		getDayContributions,
		type IDayContributions,
	} from '$lib/github';
	import ContributionsCalendar from '$lib/components/contribution-calendar/ContributionsCalendar.svelte';
	import Contributions from '$lib/components/contributions-by-repository/Contributions.svelte';
	import ContributionsYear from '$lib/components/contribution-years/ContributionYears.svelte';
	import Loading from '$lib/components/UI/contribution/Loading.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { settings } from '$lib/services/settings/settings.svelte.js';
	import Settings from '$lib/components/settings/Settings.svelte';

	let { data }: { data: PageData } = $props();

	const selectedContributionsDate = new SvelteSet<string>();

	let contributionCollection = $derived(data.contribution);
	let user = $derived(data.user);
	let currentYear = $state<number | null>(null);

	let loading = $state(false);
	let errorMsg = $state<string | null>(null);
	let contributionsLoading = $state(false);

	let selectedContributionsByRepository = $state<IDayContributions[]>([]);
	let hasSelectedContributionsByRepository = $derived(selectedContributionsByRepository.length > 0);

	async function handleSelectionChange(dates: string[]) {
		try {
			contributionsLoading = true;
			const sorted = [...dates].sort((a, b) => a.localeCompare(b)).reverse();
			selectedContributionsByRepository = await getDayContributions(user.trim(), sorted);
		} catch (e) {
			console.error(e);
		} finally {
			contributionsLoading = false;
		}
	}

	async function handleFetch() {
		loading = true;
		errorMsg = null;
		try {
			const result = await getContributionsCalendar(user.trim(), currentYear);
			contributionCollection = result.contribution;
			user = result.user;
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Something went wrong';
		} finally {
			loading = false;
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

	function reset() {
		selectedContributionsDate.clear();
		currentYear = null;
		handleFetch();
	}
</script>

<div
	class="container"
	style={Object.entries(settings)
		.map(([k, v]) => `${k}: ${v}`)
		.join('; ')}
>
	<button onclick={reset}>Reset</button>
	<form
		class="controls"
		onsubmit={(e) => {
			e.preventDefault();
			handleFetch();
		}}
	>
		<input type="text" bind:value={user} placeholder="User" />
		<button type="submit" disabled={loading || !user.trim()}>
			{loading ? 'Loading…' : 'Fetch'}
		</button>
	</form>
	<div>
		<div class="contributions-calendar">
			<ContributionsCalendar
				{contributionCollection}
				{selectedContributionsDate}
				onSelectionChange={handleSelectionChange}
			/>
			<ContributionsYear
				contributionYears={contributionCollection.contributionYears}
				onClicked={changeYear}
				selectedYear={currentYear}
			/>
		</div>
		{#if hasSelectedContributionsByRepository}
			<div class="contributions-container">
				{#if contributionsLoading}
					<Loading />
				{:else}
					<Contributions {selectedContributionsByRepository} {user} onDeleteByDate={deleteByDate} />
				{/if}
			</div>
		{/if}
	</div>
	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}
</div>

<Settings />

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.contributions-calendar {
		width: 800px;

		background-color: var(--primary-color);

		border-radius: var(--radius-lg);

		padding: var(--space-4);
	}

	.contributions-container {
		padding: var(--space-4);
		border-radius: var(--radius-lg);

		background-color: var(--primary-color);
	}
</style>
