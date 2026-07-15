<script lang="ts">
	import type { IContributionByRepository, ICommitNode } from '$lib/github';
	import { contributionTitle, pluralize } from '$lib/util/string';
	import { nodesOf, sumCommits } from '$lib/util/contributions';

	let {
		dayContributions,
		user,
		date,
	}: {
		dayContributions: IContributionByRepository<ICommitNode>[];
		user: string;
		date: string;
	} = $props();

	const nodes = $derived(sumCommits(nodesOf(dayContributions)));
</script>

{#if nodes > 0}
	<div class="repositories-container">
		<div class="timeline"></div>
		<div class="repositories">
			<h3>
				{contributionTitle({
					action: 'Contributed',
					count: nodes,
					noun: 'commit',
					repositoryCount: dayContributions.length,
				})}
			</h3>

			{#each dayContributions as commitContribution}
				{@const commits = sumCommits(commitContribution.contributions.nodes)}
				<div class="repository-container">
					<a class="repository-name" href={commitContribution.repository.url} target="_blank">
						{commitContribution.repository.nameWithOwner}
					</a>
					<p>
						<a
							class="repository-commits"
							href={`${commitContribution.repository.url}/commits?author=${user}&since=${date}&until=${date}`}
							target="_blank">{commits} {pluralize(commits, 'commit')}</a
						>
					</p>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	p {
		margin: 0;
		padding: 0;
	}

	.repository-container {
		display: flex;
		gap: 8px;
		justify-content: space-between;

		a {
			text-decoration: none;
		}

		a:hover {
			text-decoration: underline;
		}

		.repository-name {
			font-size: 16px;
		}

		.repository-commits {
			font-size: 14px;
		}
	}

	.repositories-container {
		display: flex;
		gap: 8px;

		.repositories {
			display: flex;
			flex-direction: column;
			gap: 4px;
			flex: 1;

			h3 {
				margin: 0;
			}

			.no-activity {
				align-self: center;
				justify-self: center;
			}
		}

		.timeline {
			width: 2px;
			background-color: gray;
			margin: 0 8px;
		}
	}
</style>
