<script>
	const WEEKS = 20;
	const DAYS = 7;
	const EDGE_DAYS = 4;
	const LEVELS = [0, 0, 0, 0, 0, 1, 2, 3, 4];

	const contributions = Array.from({ length: WEEKS }, (_, i) => {
		const len = i === 0 || i === WEEKS - 1 ? EDGE_DAYS : DAYS;

		return Array.from({ length: len }, () => ({
			level: LEVELS[Math.floor(Math.random() * LEVELS.length)],
		}));
	});
</script>

<div class="container">
	{#each contributions as contribution, index}
		<div class="block">
			{#each contribution as contributionDay}
				<div class={['cell', `level-${contributionDay.level}`]}></div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		display: flex;
		gap: 2px;
	}

	.block {
		position: relative;

		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.block:first-child {
		align-self: flex-end;
	}

	.block:last-child {
		align-self: flex-start;
	}

	.cell {
		width: 8px;
		height: 8px;
		padding: 0;
		border: none;
		border-radius: 2px;
	}

	.cell.level-0 {
		background-color: var(--gh-level-0, #ebedf0);
	}
	.cell.level-1 {
		background-color: var(--gh-level-1, #9be9a8);
	}
	.cell.level-2 {
		background-color: var(--gh-level-2, #40c463);
	}
	.cell.level-3 {
		background-color: var(--gh-level-3, #30a14e);
	}
	.cell.level-4 {
		background-color: var(--gh-level-4, #216e39);
	}
</style>
