export const QUERY = `
  query($user: String!) {
    user(login: $user) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
    }
  }
  `;

export const LEVELS = {
    NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
} as const;

export type ContributionData = { total: number; weeks: { date: string; count: number; level: keyof typeof LEVELS }[][] };