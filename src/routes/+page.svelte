<script lang="ts">
	import type { PageData } from './$types';
	import { getContributionsCalendar } from '$lib/github';
	import ContributionsCalendar from '$lib/components/ContributionsCalendar.svelte';
	import Settings from '$lib/components/settings/Settings.svelte';
	import Shortcut from '$lib/components/Shortcut.svelte';

	let { data }: { data: PageData } = $props();

	let contributionCollection = $derived(data.contribution);
	let user = $derived(data.user);

	let errorMsg = $state<string | null>(null);

	async function handleFetch() {
		errorMsg = null;
		try {
			const result = await getContributionsCalendar(user.trim());
			contributionCollection = result.contribution;
			user = result.user;
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Something went wrong';
		}
	}
</script>

<div class="container">
	<form
		class="controls"
		onsubmit={(e) => {
			e.preventDefault();
			handleFetch();
		}}
	>
		<input type="text" bind:value={user} placeholder="User" />
		<button type="submit" disabled={!user.trim()}> Fetch </button>
	</form>
	<ContributionsCalendar {contributionCollection} {user} />
	<Shortcut description="Select all contributions" key="Shift + A" />
	<Shortcut description="Deselect all contributions" key="Shift + Backspace" />
	<Settings />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}
</style>
