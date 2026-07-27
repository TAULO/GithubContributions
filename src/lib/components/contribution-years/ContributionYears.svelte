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
</script>

<div
	style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; flex-direction: row-reverse; margin-top: 1rem;"
>
	{#each contributionYears as year}
		<div class="year-button-container">
			<button {disabled} onclick={() => onClicked(year)}>{year}</button>
			<div class="selected-year-dot" class:selected={selectedYear === year}></div>
		</div>
	{/each}
</div>

<style>
	.year-button-container {
		position: relative;

		button {
			position: relative;
			background-color: var(--tertiary-color);
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

		.selected-year-dot.selected {
			position: absolute;
			top: 40px;
			left: 50%;
			transform: translateX(-50%);
			background-color: var(--tertiary-color);
			width: 8px;
			height: 8px;
			border-radius: 50%;
		}

		.selected-year-dot {
			transition: background-color 0.5s ease;
			animation: pulse 2s infinite;
		}
	}
</style>
