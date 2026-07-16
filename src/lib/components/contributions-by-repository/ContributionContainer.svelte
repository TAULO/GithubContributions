<script lang="ts">
	let { children } = $props();
</script>

<div class="contribution-container">
		{@render children()}
</div>

<style>
	.contribution-container {
		display: flex;
		flex-direction: column;
		margin-left: 2rem;
		flex: 1;
	}
</style>
