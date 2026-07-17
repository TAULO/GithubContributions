<script lang="ts">
	import type { IRepository } from '$lib/github';

	let { repo }: { repo: IRepository } = $props();
</script>

<div class="container">
	<a href={repo.url} target="_blank" rel="noopener noreferrer">
		{repo.nameWithOwner}
	</a>
	<div class="langauge-bar">
		{#each repo.languages.items as language}
			<div
				style:background-color={language.color}
				style:width={`${language.percentage * 100}%`}
				style:height="'100%'"
				title={language.name}
			></div>
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		gap: 8px;
		flex-direction: column;

		a {
			color: var(--sub-title-color);
			font-weight: 500;
			width: fit-content;
		}

		a:hover {
			color: var(--hover-color);
		}

		.langauge-bar {
			display: flex;
			width: 150px;
			height: 8px;
			overflow: hidden;
			border-radius: 4px;
		}
	}
</style>
