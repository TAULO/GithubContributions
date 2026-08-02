<script lang="ts">
	let {
		description,
		key,
	}: {
		description: string;
		key: string;
	} = $props();
</script>

<div class="shortcut-container">
	<p>{description}</p>
	<div class="shortcut">
		<kbd>{key}</kbd>
	</div>
</div>

<style>
	.shortcut-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 50%;

		p {
			margin: 0;
			font-size: var(--font-size-sm);
			color: var(--text-primary);
		}

		.shortcut {
			background-color: var(--primary-color);
			border-radius: var(--radius-lg);
			border: 1px solid var(--border);
			border-bottom: 4px solid var(--border);
			box-shadow: var(--shadow);
			width: fit-content;

			kbd {
				padding: 0.5rem 0.5rem;
				color: var(--text-on-accent);
				font-size: var(--font-size-xs);
				opacity: 0.7;
			}
		}
	}
</style>
