<script lang="ts">
	let {
		contributionYears,
		disabled = false,
		onClicked,
		selectedYear = null,
	}: {
		contributionYears: Array<number>;
		disabled?: boolean;
		onClicked: (year: number) => void;
		selectedYear?: number | null;
	} = $props();

	let sortedYears = $derived([...contributionYears].sort((a, b) => a - b));
</script>

<div class="contribution-years-container">
	{#each sortedYears as year}
		<div class="year-button-container">
			<button {disabled} onclick={() => onClicked(year)}>{year}</button>
			<div class="selected-year-dot" class:selected={selectedYear === year}></div>
		</div>
	{/each}
</div>

<style>
	.contribution-years-container {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 1rem;

		.year-button-container {
			position: relative;

			button {
				position: relative;
				background-color: var(--tertiary-color);
				color: var(--text-on-accent);
				border: none;
				border-radius: 0.2rem;
				box-shadow: var(--shadow);
				padding: 0.5rem 1rem;
				z-index: 1;
			}

			button:hover {
				background-color: var(--hover-color);
				cursor: pointer;
			}

			.selected-year-dot {
				position: absolute;
				top: 40px;
				left: 50%;
				transform: translateX(-50%);
				width: 8px;
				height: 8px;
				border-radius: 50%;
				background-color: var(--tertiary-color);
				opacity: 0;
				transition: opacity 0.3s ease;
			}

			.selected-year-dot.selected {
				opacity: 1;
				animation: pulse 2s infinite;
			}
		}
	}
</style>
