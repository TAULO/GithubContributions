import { type ITheme, type ThemeName } from '$lib/services/settings/types';
import { DEFAULT_SETTINGS } from '$lib/services/settings/defaults';

export const THEMES: Record<ThemeName, ITheme> = {
	default: {
		label: 'Default',
		values: {
			...DEFAULT_SETTINGS,
		},
	},
	halloween: {
		label: 'Halloween',
		values: {
			'--primary-color': '#17223a',
			'--secondary-color': '#003946',
			'--tertiary-color': '#ff6b1a',
			'--sub-title-color': '#e94560',
			'--hover-color': '#ff9a3c',
			'--gh-level-0': '#2a2a3e',
			'--gh-level-1': '#5c2e0e',
			'--gh-level-2': '#a84315',
			'--gh-level-3': '#e85d04',
			'--gh-level-4': '#f47915',
		},
	},
	dracula: {
		label: 'Dracula',
		values: {
			'--primary-color': '#282a36',
			'--secondary-color': '#21222c',
			'--tertiary-color': '#bd93f9',
			'--sub-title-color': '#6272a4',
			'--hover-color': '#ff79c6',
			'--gh-level-0': '#282a36',
			'--gh-level-1': '#44475a',
			'--gh-level-2': '#6272a4',
			'--gh-level-3': '#8be9fd',
			'--gh-level-4': '#bd93f9',
		},
	},
	ocean: {
		label: 'Ocean',
		values: {
			'--primary-color': '#0b192f',
			'--secondary-color': '#0f2440',
			'--tertiary-color': '#38bdf8',
			'--sub-title-color': '#64748b',
			'--hover-color': '#7dd3fc',
			'--gh-level-0': '#0f2440',
			'--gh-level-1': '#0e4a6e',
			'--gh-level-2': '#0d7490',
			'--gh-level-3': '#22a5b8',
			'--gh-level-4': '#38bdf8',
		},
	},
	monochrome: {
		label: 'Monochrome',
		values: {
			'--primary-color': '#0a0a0a',
			'--secondary-color': '#171717',
			'--tertiary-color': '#e5e5e5',
			'--sub-title-color': '#737373',
			'--hover-color': '#fafafa',
			'--gh-level-0': '#171717',
			'--gh-level-1': '#404040',
			'--gh-level-2': '#737373',
			'--gh-level-3': '#a3a3a3',
			'--gh-level-4': '#e5e5e5',
		},
	},
	matrix: {
		label: 'Matrix',
		values: {
			'--primary-color': '#000000',
			'--secondary-color': '#0a0f0a',
			'--tertiary-color': '#00ff41',
			'--sub-title-color': '#4d7c4d',
			'--hover-color': '#7fff7f',
			'--gh-level-0': '#0a0f0a',
			'--gh-level-1': '#0d3d1a',
			'--gh-level-2': '#127a2e',
			'--gh-level-3': '#00c853',
			'--gh-level-4': '#00ff41',
		},
	},
};
