<script lang="ts">
	import type { Snippet } from 'svelte';

	let { text, children }: { text: string; children?: Snippet } = $props();
</script>

<div class="container">
	<div class="badge">
		{#if children}
			{@render children()}
		{/if}
	</div>
	<h3>{text}</h3>
</div>

<style>
	.container {
		display: flex;
		align-items: center;

		h3 {
			justify-self: center;
			align-self: center;
			font-size: var(--font-size-lg);
			font-weight: var(--font-weight-normal);
			color: var(--text-secondary);
		}

		.badge {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			border-radius: var(--radius-full);
			background-color: var(--tertiary-color);
			position: absolute;
			left: 0;
			margin: 0 0 0 -18px;
			z-index: 1;
			/* Note: This is a hack to make the badge appear above the timeline, therefor the color must match the background color of the timeline */
			border: 0.225rem solid var(--primary-color);
			color: white;
			transition: var(--theme-transition);
		}
	}
</style>
