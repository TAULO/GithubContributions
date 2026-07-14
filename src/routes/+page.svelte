<script lang="ts">
	import type { PageData } from './$types';
	import {
		getContributions,
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

	async function handleSelectionChange(dates: string[]) {
		selectedContributionsByRepository = await getContributionsByRepository(user.trim(), dates);
	}

	async function handleFetch() {
		loading = true;
		errorMsg = null;
		try {
			const result = await getContributions(user.trim(), currentYear);
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
		<div class="contributions-calendar">
			<ContributionsCalendar {contributionCollection} onSelectionChange={handleSelectionChange} />
			<ContributionsYear
				contributionYears={contributionCollection.contributionYears}
				onClicked={changeYear}
			/>
			<Contributions {selectedContributionsByRepository} {user} />
		</div>
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
		border-radius: 8px;
		width: fit-content;
	}
</style>
