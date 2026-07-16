<script lang="ts">
	import type { IRepository } from '$lib/github';

	let { repo }: { repo: IRepository } = $props();
</script>

<a href={repo.url} target="_blank" rel="noopener noreferrer">
	{repo.nameWithOwner}
</a>

<style>
	a {
		color: var(--link, #3b82f6);
		text-decoration: none;
		font-weight: 500;
		width: fit-content;
	}

	a:hover {
		color: var(--link-hover, #2563eb);
	}

	a:focus-visible {
		outline: 2px solid var(--link, #3b82f6);
		outline-offset: 2px;
		border-radius: 2px;
	}
</style>
