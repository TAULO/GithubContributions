<script lang="ts">
	let {
		contributionYears,
		onClicked,
		selectedYear = null,
	}: {
		contributionYears: Array<number>;
		onClicked: (year: number) => void;
		selectedYear?: number | null;
	} = $props();

	let sortedYears = $derived([...contributionYears].sort((a, b) => a - b));
</script>

<div class="contribution-years-container">
	{#each sortedYears as year}
		{@const selected = selectedYear === year}
		<div class="year-button-container">
			<button
				class:selected
				class:not-selected={!selected && selectedYear !== null}
				onclick={() => onClicked(year)}>{year}</button
			>
		</div>
	{/each}
</div>

<style>
	.contribution-years-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);

		.year-button-container {
			button {
				position: relative;
				background-color: var(--tertiary-color);
				color: var(--text-on-accent);
				border: none;
				border-radius: var(--radius-md);
				box-shadow: var(--shadow);
				padding: 0.5rem 1rem;
				z-index: 1;
				opacity: 1;
				transition: opacity 0.2s ease-in-out;
			}

			button:hover {
				background-color: var(--hover-color);
				cursor: pointer;
			}

			button.selected {
				opacity: 1;
			}

			button.not-selected {
				opacity: 0.5;
			}
		}
	}
</style>
