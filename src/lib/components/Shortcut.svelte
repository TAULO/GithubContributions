<script lang="ts">
	let {
		description,
		keys,
	}: {
		description: string;
		keys: string[];
	} = $props();
</script>

<div class="shortcut-container">
	<p>{description}</p>
	<div class="shortcut">
		{#each keys as key, index}
			<kbd>{key}</kbd>{#if index !== keys.length - 1}<span>+</span>{/if}
		{/each}
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
			font-size: var(--font-size-xs);

			kbd {
				color: var(--text-on-accent);
				opacity: 0.7;
				line-height: 1.5;
			}

			kbd:first-child {
				padding-left: 0.5rem;
			}

			kbd:last-child {
				padding-right: 0.5rem;
			}

			span {
				color: var(--text-secondary);
				padding: 0 0.25rem;
			}
		}
	}
</style>
