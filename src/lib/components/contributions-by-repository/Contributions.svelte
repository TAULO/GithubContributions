<script lang="ts">
	import type { IContributionByRepository, IDayContributions } from '$lib/github';

	let {
		selectedContributionsByRepository,
		user,
	}: { selectedContributionsByRepository: IDayContributions[]; user: string } = $props();

	let totalCommits = $derived(
		selectedContributionsByRepository
			.flatMap((d) => d.commitContributionsByRepository)
			.flatMap((c) => c.contributions.nodes)
			.reduce((acc, n) => acc + n.commitCount, 0),
	);

	const totalCommitsForRepository = (commitContribution: IContributionByRepository) => {
		return commitContribution.contributions.nodes.reduce((acc, n) => {
			return acc + n.commitCount;
		}, 0);
	};

	const prettyDate = (date: string) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};
</script>

<div>
	<p>{totalCommits}</p>
	{#each selectedContributionsByRepository as contributionByRepository}
		<p>{prettyDate(contributionByRepository.date)}</p>
		{#each contributionByRepository.commitContributionsByRepository as commitContribution}
			<div style="display: flex; gap: 12px">
				<a href={commitContribution.repository.url} target="_blank">
					{commitContribution.repository.nameWithOwner}
				</a>
				<p>
					<a
						href={`${commitContribution.repository.url}/commits?author=${user}&since=${contributionByRepository.date}&until=${contributionByRepository.date}`}
						target="_blank">{totalCommitsForRepository(commitContribution)} commits</a
					>
				</p>
			</div>
		{/each}
		<hr />
	{/each}
</div>
