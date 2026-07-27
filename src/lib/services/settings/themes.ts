import type { ITheme } from '$lib/services/settings/types';

export const THEMES: Record<string, ITheme> = {
	halloween: {
		label: 'Halloween',
		values: {
			'--primary-color': '#172a3a',
			'--secondary-color': '#16213e',
			'--tertiary-color': '#ff6b1a',
			'--sub-title-color': '#e94560',
			'--hover-color': '#ff9a3c',
			'--gh-level-0': '#2a2a3e',
			'--gh-level-1': '#5c2e0e',
			'--gh-level-2': '#a84315',
			'--gh-level-3': '#e85d04',
			'--gh-level-4': '#ff9a3c',
		},
	},
};
