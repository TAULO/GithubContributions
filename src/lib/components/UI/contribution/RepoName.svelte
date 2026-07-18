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

		.language-bar-item:not(:last-child) {
			border-right: 2px solid var(--primary-color);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.language-info-container {
			display: flex;
			gap: 16px;

			.language-info-item {
				display: flex;
				align-items: center;
				gap: 4px;
			}

			p {
				margin: 0;
				padding: 0;
				font-size: 12px;
			}

			.language-dot {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				margin-right: 4px;
			}

			.language-name {
				color: var(--sub-title-color);
				font-weight: 500;
			}

			.language-percentage {
				color: var(--sub-title-color);
				opacity: 0.7;
			}
		}
	}
</style>
