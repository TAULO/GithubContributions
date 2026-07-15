<script lang="ts">
	import type { IContributionByRepository, ICommit } from '$lib/github';
	import { contributionTitle, pluralize } from '$lib/util/string';
	import { sumCommits } from '$lib/util/contributions';

	let {
		dayContributions,
		user,
		date,
	}: {
		dayContributions: IContributionByRepository<ICommit>[];
		user: string;
		date: string;
	} = $props();

	const commits = $derived(sumCommits(dayContributions.flatMap((d) => d.contributions)));
</script>

{#if commits > 0}
	<div class="repositories-container">
		<div class="repositories">
			<h3>
				{contributionTitle({
					action: 'Contributed',
					count: commits,
					noun: 'commit',
					repositoryCount: dayContributions.length,
				})}
			</h3>

			{#each dayContributions as commitContribution}
				{@const commits = sumCommits(commitContribution.contributions)}
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
		flex: 1;

		.repositories {
			display: flex;
			flex-direction: column;
			gap: 4px;
			flex: 1;

			h3 {
				margin: 0;
			}
		}
	}
</style>
