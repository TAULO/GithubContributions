<script lang="ts">
	let {
		contributionYears,
		disabled = false,
	}: { contributionYears: Array<string | number>; disabled?: boolean } = $props();
</script>

<div
	style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; flex-direction: row-reverse; margin-top: 1rem;"
>
	{#each contributionYears as year}
		<button {disabled} onclick={() => {}}>{year}</button>
	{/each}
</div>
