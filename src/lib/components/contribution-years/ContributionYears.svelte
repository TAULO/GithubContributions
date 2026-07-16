<script lang="ts">
	let {
		contributionYears,
		disabled = false,
		onClicked,
	}: {
		contributionYears: Array<number>;
		disabled?: boolean;
		onClicked: (year: number) => void;
	} = $props();
</script>

<div
	style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; flex-direction: row-reverse; margin-top: 1rem;"
>
	{#each contributionYears as year}
		<button {disabled} onclick={() => onClicked(year)}>{year}</button>
	{/each}
</div>

<style>
	button {
		background-color: var(--tertiary-color);
		border: none;
		border-radius: 0.2rem;
		box-shadow: var(--shadow);
		padding: 0.5rem 1rem;
	}

	button:hover {
		background-color: var(--hover-color);
		cursor: pointer;
	}
</style>
