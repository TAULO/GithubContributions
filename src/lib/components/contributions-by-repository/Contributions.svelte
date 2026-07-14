<script lang="ts">
	import type {
		IContributionByRepository,
		IContributionNode,
		IDayContributions,
	} from '$lib/github';

	let {
		selectedContributionsByRepository,
		user,
	}: { selectedContributionsByRepository: IDayContributions[]; user: string } = $props();

	const sumCommits = (nodes: IContributionNode[]) =>
		nodes.reduce((acc, n) => acc + n.commitCount, 0);

	const nodesOf = (repos: IContributionByRepository[]) =>
		repos.flatMap((r) => r.contributions.nodes);

	let totalCommits = $derived(
		sumCommits(
			nodesOf(selectedContributionsByRepository.flatMap((d) => d.commitContributionsByRepository)),
		),
	);

	const prettyDate = (date: string) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const pluralize = (count: number, noun: string, plural = `${noun}s`) =>
		`${count} ${count === 1 ? noun : plural}`;
</script>

<div class="container">
	<p>{totalCommits}</p>
	{#each selectedContributionsByRepository as contributionByRepository}
		<div class="contribution-container">
			<div class="date-container">
				<p>{prettyDate(contributionByRepository.date)}</p>
				<div class="line"></div>
			</div>
			<div class="repositories-container">
				<div class="timeline"></div>
				<div class="repositories">
					<h3>
						Created {pluralize(
							sumCommits(nodesOf(contributionByRepository.commitContributionsByRepository)),
							'commit',
						)} in {pluralize(
							contributionByRepository.commitContributionsByRepository.length,
							'repository',
							'repositories',
						)}
					</h3>
					{#each contributionByRepository.commitContributionsByRepository as commitContribution}
						<div class="repository-container">
							<a class="repository-name" href={commitContribution.repository.url} target="_blank">
								{commitContribution.repository.nameWithOwner}
							</a>
							<p>
								<a
									class="repository-commits"
									href={`${commitContribution.repository.url}/commits?author=${user}&since=${contributionByRepository.date}&until=${contributionByRepository.date}`}
									target="_blank"
									>{pluralize(sumCommits(commitContribution.contributions.nodes), 'commit')}</a
								>
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	p {
		margin: 0;
		padding: 0;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.date-container {
		display: flex;
		align-items: center;
		gap: 16px;

		.line {
			flex: 1;
			background-color: gray;
			height: 1px;
		}
	}

	.contribution-container {
		display: flex;
		flex-direction: column;
		gap: 8px;

		h3 {
			margin: 0;
		}
	}

	.repository-container {
		display: flex;
		gap: 8px;

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
		height: 100%;
		gap: 8px;

		.repositories {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.timeline {
			width: 2px;
			background-color: gray;
			margin: 0 8px;
		}
	}
</style>
