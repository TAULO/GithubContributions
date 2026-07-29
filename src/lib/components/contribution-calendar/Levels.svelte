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
	{#each levelColors as color}
		<div class="display-cell" style="background-color: {`var(${color})`}"></div>
	{/each}
</div>

<style>
	.display-cell-container {
		display: flex;
		gap: 2px;
		align-self: end;

		.display-cell {
			width: 12px;
			height: 12px;
			padding: 0;
			border: none;
			border-radius: 2px;
		}
	}
</style>
