<script lang="ts">
	import type { ContributionDay } from '$lib/github';

	interface IProps {
		contributionDay: ContributionDay;
		selected?: boolean;
		dimmed?: boolean;
		onToggleSelected?: () => void;
		highlighted?: boolean;
		interactive?: boolean;
		disabled?: boolean;
	}

	let {
		contributionDay,
		selected = false,
		dimmed = false,
		onToggleSelected,
		highlighted = false,
		interactive = false,
		disabled = false,
	}: IProps = $props();
</script>

<button
	class={[
		'cell',
		`level-${contributionDay.level}`,
		selected && 'selected',
		dimmed && 'dimmed',
		highlighted && 'highlighted',
		interactive && 'interactive',
	]}
	title={contributionDay.date}
	onclick={onToggleSelected}
	{disabled}
></button>

<style>
	.cell {
		width: 12px;
		height: 12px;
		padding: 0;
		border: none;
		border-radius: var(--radius-sm);
		background: transparent;
		cursor: pointer;
	}

	.cell.dimmed {
		opacity: 0.7;
	}

	.cell.selected {
		border: 1px solid var(--hover-color);
	}

	.cell.highlighted {
		border: 1px solid var(--hover-color);
		opacity: 1;
	}

	.cell.interactive:hover {
		border: 1px solid var(--hover-color);
	}

	.cell:disabled {
		cursor: default;
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
