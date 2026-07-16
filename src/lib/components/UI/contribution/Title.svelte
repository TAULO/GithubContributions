<script lang="ts">
	let { text }: { text: string } = $props();
</script>

<h3 class="">{text}</h3>

<style>
	h3 {
		/* aligns with the badge for contributions */
		margin-top: 6px;
		margin-bottom: 6px;
	}
</style>
