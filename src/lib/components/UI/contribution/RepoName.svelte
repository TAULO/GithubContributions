<script lang="ts">
	import type { IRepository } from '$lib/github';

	let { repo }: { repo: IRepository } = $props();
</script>

<a href={repo.url} target="_blank" rel="noopener noreferrer">
	{repo.nameWithOwner}
</a>

<style>
	a {
		color: var(--sub-title-color);
		font-weight: 500;
		width: fit-content;
	}

	a:hover {
		color: var(--hover-color);
	}
</style>
