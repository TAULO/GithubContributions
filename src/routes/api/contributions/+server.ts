// src/routes/api/contributions/+server.ts
import { json, error } from '@sveltejs/kit';
import { GITHUB_ACCESS_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

import { QUERY, LEVELS } from '$lib/github';

function getFromTo(yearParam: string | null) {
    let from: string, to: string;

    const year = yearParam ? Number(yearParam) : NaN;

    if (Number.isInteger(year)) {
        from = `${year}-01-01T00:00:00Z`;
        to   = `${year}-12-31T23:59:59Z`;
    } else {
        const now = new Date();
        to = now.toISOString();
        from = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000).toISOString();
    }

    return { from, to }
}

export const GET: RequestHandler = async ({ url, fetch }) => {
    const user = url.searchParams.get('user');
    if (!user) throw error(400, 'Missing ?user= parameter');

    const yearParam = url.searchParams.get('year');
    const { from, to } = getFromTo(yearParam);

    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ query: QUERY, variables: { user, from, to, } }),
    });

    if (!res.ok) throw error(res.status, 'GitHub request failed');
    const payload = await res.json();

    if (payload.errors) throw error(502, payload.errors[0]?.message ?? 'GraphQL error');

    const cal = payload.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) throw error(404, `User "${user}" not found`);

    const weeks = cal.weeks.map((w: any) =>
        w.contributionDays.map((d: any) => ({
            date: d.date,
            count: d.contributionCount,
            level: LEVELS[d.contributionLevel as keyof typeof LEVELS],
        }))
    );

    return json(
        { total: cal.totalContributions, weeks },
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600',
            },
        }
    );
};