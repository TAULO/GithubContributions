<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children?: Snippet } = $props();
</script>

<div class="badge">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 50%;
		background-color: #212830;
		position: relative;
		margin: -5px 8px 0 -16.5px;
		z-index: 1;
		/* Note: This is a hack to make the badge appear above the timeline, therefor the color must match the background color of the timeline */
		border: 0.225rem solid white;
		color: white;
	}
</style>
