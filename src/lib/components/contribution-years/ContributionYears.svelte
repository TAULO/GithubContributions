<script lang="ts">
	let {
		contributionYears,
		onClicked,
		selectedContributionForYear,
		selectedYear = null,
	}: {
		contributionYears: Array<number>;
		onClicked: (year: number) => void;
		selectedContributionForYear: Record<string, string[]>;
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
				class:has-selected-contributions={selectedContributionForYear[year]?.length > 0}
				onclick={() => onClicked(year)}>{year}</button
			>
			{#if selectedContributionForYear[year]}
				<!--				<p>{selectedContributionForYear[year].length}</p>-->
			{/if}
		</div>
	{/each}
</div>

<style>
	.contribution-years-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);

		.year-button-container {
			position: relative;

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
				transition:
					opacity 0.2s ease-in-out,
					background-color 150ms ease;
			}

			button:hover {
				background-color: var(--hover-color);
				opacity: 1 !important;
				cursor: pointer;
			}

			button.selected {
				opacity: 1;
			}

			button.not-selected {
				opacity: 0.5;
			}

			button.has-selected-contributions {
				background-color: var(--hover-color);
			}

			p {
				position: absolute;
				top: -18px;
				right: -10px;
				min-width: 1.25rem;
				height: 1.25rem;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: var(--tertiary-color);
				color: var(--text-on-accent);
				border-radius: var(--radius-full);
				font-size: var(--font-size-xs);
				font-weight: var(--font-weight-normal);
				line-height: 1;
				box-shadow: 0 0 0 2px var(--primary-color); /* ring separates badge from button */
				z-index: 2;
			}

			p:hover {
				cursor: pointer;
				background-color: var(--hover-color);
			}
		}
	}
</style>
