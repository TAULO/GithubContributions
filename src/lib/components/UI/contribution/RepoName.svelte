<script lang="ts">
	import type { IRepository } from '$lib/github';

	let { repo }: { repo: IRepository } = $props();

	const formatPercentage = (value: number) => {
		const percentage = value * 100;
		return repo.languages.items.length > 1 ? `${percentage.toFixed(1)}%` : `${percentage}%`;
	};
</script>

<div class="container">
	<a href={repo.url} target="_blank" rel="noopener noreferrer">
		{repo.nameWithOwner}
	</a>
	{#if repo.languages.items.length > 0}
		<div class="langauge-bar">
			{#each repo.languages.items as language}
				<div
					class="language-bar-item"
					style:background-color={language.color}
					style:width={`${language.percentage * 100}%`}
					style:height="'100%'"
					title={language.name}
				></div>
			{/each}
		</div>
		<div class="language-info-container">
			{#each repo.languages.items.slice(0, 3) as language}
				<div class="language-info-item">
					<div class="language-dot" style:background-color={language.color}></div>
					<p class="language-name">{language.name}</p>
					<p class="language-percentage">{formatPercentage(language.percentage)}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		gap: var(--space-2);
		flex-direction: column;

		a {
			color: var(--text-primary);
			font-weight: 700;
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
			border-radius: var(--radius-md);
		}

		.language-bar-item:not(:last-child) {
			border-right: 1px solid var(--primary-color);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.language-bar-item {
			min-width: 4px;
		}

		.language-info-container {
			display: flex;
			gap: var(--space-4);

			.language-info-item {
				display: flex;
				align-items: center;
				gap: var(--space-1);
			}

			p {
				margin: 0;
				padding: 0;
				font-size: 12px;
				color: var(--text-primary);
			}

			.language-dot {
				width: 8px;
				height: 8px;
				border-radius: var(--radius-full);
				margin-right: var(--space-1);
			}

			.language-name {
				color: var(--text-secondary);
				font-weight: 500;
			}

			.language-percentage {
				color: var(--text-secondary);
				opacity: 0.7;
			}
		}
	}
</style>
