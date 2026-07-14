<script lang="ts">
	import type { PageData } from './$types';
	import { getContributions } from '$lib/github';
	import ContributionsCalendar from '$lib/components/contribution-calendar/ContributionsCalendar.svelte';

	let { data }: { data: PageData } = $props();

	let contributionCollection = $state(data.contribution);
	let user = $state(data.user);
	let currentYear = $state<number>();

	let loading = $state(false);
	let errorMsg = $state<string | null>(null);

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
</script>

<div class="container">
	<div>
		<h1>Contributions for {user} ({currentYear})</h1>
		<div class="contributions-calendar">
			<ContributionsCalendar {contributionCollection} />
			<div
				style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; flex-direction: row-reverse; margin-top: 1rem;"
			>
				{#each contributionCollection.contributionYears as year}
					<button
						disabled={!user.trim()}
						onclick={() => {
							currentYear = year;
							user = user;
							handleFetch();
						}}>{year}</button
					>
				{/each}
			</div>
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
