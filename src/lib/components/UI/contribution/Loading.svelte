<script lang="ts">
	const levelColors = [
		'--gh-level-0',
		'--gh-level-1',
		'--gh-level-2',
		'--gh-level-3',
		'--gh-level-4',
	];
</script>

<div class="display-cell-container">
	{#each levelColors as color, i}
		<div
			class="display-cell"
			style="background-color: {`var(${color})`}; animation-delay: {i * 100}ms"
		></div>
	{/each}
</div>

<style>
	.display-cell-container {
		display: flex;
		gap: var(--space-2);
		align-self: center;
		position: relative;
		top: var(--space-8);

		.display-cell {
			width: 12px;
			height: 12px;
			padding: 0;
			border: none;
			border-radius: 2px;
			animation: cell-pulse 1s ease-in-out infinite;
		}
	}

	@keyframes cell-pulse {
		0%,
		100% {
			transform: scale(1);
		}
		30% {
			transform: scale(1.4);
		}
	}
</style>
