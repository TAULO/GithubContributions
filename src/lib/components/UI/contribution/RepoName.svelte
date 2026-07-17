<script lang="ts">
	import type { IRepository } from '$lib/github';

	let { repo }: { repo: IRepository } = $props();
</script>

<div class="container">
	<a href={repo.url} target="_blank" rel="noopener noreferrer">
		{repo.nameWithOwner}
	</a>
	{#if repo.primaryLanguage}
		{@const primaryLanguage = repo.primaryLanguage}
		<div class="language-container">
			<div class="langauge-color" style="background-color: {primaryLanguage.color}"></div>
			<p>{primaryLanguage.name}</p>
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		gap: 8px;

		a {
			color: var(--sub-title-color);
			font-weight: 500;
			width: fit-content;
		}

		a:hover {
			color: var(--hover-color);
		}

		.language-container {
			display: flex;
			align-items: center;
			gap: 4px;

			.langauge-color {
				width: 8px;
				height: 8px;
				border-radius: 50%;
			}

			p {
				margin: 0;
				padding: 0;
			}
		}
	}
</style>
