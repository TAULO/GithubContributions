import type { ISetting, SettingKey } from '$lib/services/settings/types';

export const DEFAULT_SETTINGS: Record<SettingKey, string> = {
	// Primary Colors
	'--primary-color': '#172a3a',
	'--secondary-color': '#004346',
	'--tertiary-color': '#09bc8a',
	'--sub-title-color': '#508991',
	'--hover-color': '#74b3ce',

	// Contribution Day Levels Colors
	'--gh-level-0': '#1e3040',
	'--gh-level-1': '#0d5a45',
	'--gh-level-2': '#0a8865',
	'--gh-level-3': '#09bc8a',
	'--gh-level-4': '#52e0b6',
};
