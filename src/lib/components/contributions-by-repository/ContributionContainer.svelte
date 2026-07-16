<script lang="ts">
	let { children } = $props();
</script>

<div class="contribution-container">
	<div class="contribution-container-inner">
		{@render children()}
	</div>
</div>

<style>
	.contribution-container {
		display: flex;
		flex-direction: column;
		margin-left: 2rem;
	}

	.contribution-container-inner {
		flex: 1;
	}
</style>
