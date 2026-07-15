<script lang="ts">
	import type { PageData } from './$types';
	import {
		getContributionsCalendar,
		getContributionsByRepository,
		type IDayContributions,
	} from '$lib/github';
	import ContributionsCalendar from '$lib/components/contribution-calendar/ContributionsCalendar.svelte';
	import Contributions from '$lib/components/contributions-by-repository/Contributions.svelte';
	import ContributionsYear from '$lib/components/contribution-years/ContributionYears.svelte';

	let { data }: { data: PageData } = $props();

	let contributionCollection = $derived(data.contribution);
	let user = $derived(data.user);
	let currentYear = $state<number>();

	let loading = $state(false);
	let errorMsg = $state<string | null>(null);

	let selectedContributionsByRepository = $state<IDayContributions[]>([]);
	let hasSelectedContributionsByRepository = $derived(selectedContributionsByRepository.length > 0);

	async function handleSelectionChange(dates: string[]) {
		selectedContributionsByRepository = await getContributionsByRepository(user.trim(), dates);
		// April 3, 2026
		console.log(selectedContributionsByRepository);
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
		currentYear = year;
		handleFetch();
	}
</script>

<div class="container">
	<div>
		<h1>Contributions for {user} ({currentYear})</h1>
		<div class="contributions-calendar" class:standalone={!hasSelectedContributionsByRepository}>
			<ContributionsCalendar {contributionCollection} onSelectionChange={handleSelectionChange} />
			<ContributionsYear
				contributionYears={contributionCollection.contributionYears}
				onClicked={changeYear}
			/>
		</div>
		{#if hasSelectedContributionsByRepository}
			<div class="contributions-container">
				<Contributions {selectedContributionsByRepository} {user} />
			</div>
		{/if}
	</div>

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

	{#if errorMsg}
		<p class="error">{errorMsg}</p>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rem;
	}

	.contributions-calendar {
		border: 1px solid #ccc;
		padding: 1rem;
		border-radius: 8px 8px 0 0;
	}

	.contributions-calendar.standalone {
		border-radius: 8px;
	}

	.contributions-container {
		border: 1px solid #ccc;
		border-top: none;
		padding: 1rem;
		border-radius: 0 0 8px 8px;
	}
</style>
