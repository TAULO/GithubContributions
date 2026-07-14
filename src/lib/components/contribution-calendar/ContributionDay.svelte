<script lang="ts">
	import type { ContributionDay } from '$lib/github';

	interface IProps {
		contributionDay: ContributionDay;
		selected?: boolean;
		dimmed?: boolean;
		onToggleSelected?: () => void;
	}

	let { contributionDay, selected = false, dimmed = false, onToggleSelected }: IProps = $props();
</script>

<button
	class={['cell', `level-${contributionDay.level}`, selected && 'selected', dimmed && 'dimmed']}
	title={contributionDay.date}
	onclick={onToggleSelected}
></button>

<style>
	.cell {
		width: 12px;
		height: 12px;
		padding: 0;
		border: none;
		border-radius: 2px;
		cursor: pointer;
		background: transparent;
	}

	.cell.selected {
		border: 1px solid greenyellow;
	}

	.cell.dimmed {
		opacity: 0.3;
	}

	.cell:hover {
		cursor: pointer;
		border: 1px solid greenyellow;
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
