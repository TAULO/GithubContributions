<script lang="ts">
    import GithubContributions from '$lib/GithubContributions.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<h1>Contributions for {data.user}</h1>

<GithubContributions contributions={data.contributions}/>