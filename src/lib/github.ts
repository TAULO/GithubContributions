export const QUERY = `
  query($user: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $user) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }`;

export const LEVELS = {
    NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
} as const;

export type ContributionData = { total: number; weeks: { date: string; count: number; level: keyof typeof LEVELS }[][] };