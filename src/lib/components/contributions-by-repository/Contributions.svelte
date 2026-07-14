<script lang="ts">
	import type { IDayContributions } from '$lib/github';

	let { contributionsByRepository }: { contributionsByRepository: IDayContributions[] } = $props();
</script>

<div>
	{#each contributionsByRepository as contributionByRepository}
		<p>{contributionByRepository.date}</p>
		{#each contributionByRepository.commitContributionsByRepository as commitContribution}
			<div style="display: flex; gap: 12px">
				<a href={commitContribution.repository.url} target="_blank">
					{commitContribution.repository.nameWithOwner}
				</a>
				<p>
					{commitContribution.contributions.nodes.reduce((acc, node) => {
						return acc + node.commitCount;
					}, 0)}
				</p>
			</div>
		{/each}
		<hr />
	{/each}
</div>
