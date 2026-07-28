import type { ISetting, SettingKey } from '$lib/services/settings/types';
import { THEMES } from '$lib/services/settings/themes';
import { DEFAULT_SETTINGS } from '$lib/services/settings/defaults';

const COLORS: ISetting[] = [
	{
		key: '--primary-color',
		label: 'Primary Color',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--primary-color'],
	},
	{
		key: '--secondary-color',
		label: 'Secondary Color',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--secondary-color'],
	},
	{
		key: '--tertiary-color',
		label: 'Tertiary Color',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--tertiary-color'],
	},
	{
		key: '--hover-color',
		label: 'Hover Color',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--hover-color'],
	},
];

const CONTRIBUTION_LEVELS: ISetting[] = [
	{
		key: '--gh-level-0',
		label: 'No contributions',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--gh-level-0'],
	},
	{
		key: '--gh-level-1',
		label: 'Contributions level 1',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--gh-level-1'],
	},
	{
		key: '--gh-level-2',
		label: 'Contributions level 2',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--gh-level-2'],
	},
	{
		key: '--gh-level-3',
		label: 'Contributions level 3',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--gh-level-3'],
	},
	{
		key: '--gh-level-4',
		label: 'Contributions level 4',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--gh-level-4'],
	},
];

export const settings = $state<Record<string, string>>({ ...DEFAULT_SETTINGS });

export const SETTINGS_SCHEMA: ISetting[] = [...COLORS, ...CONTRIBUTION_LEVELS];

export function setSetting(key: SettingKey, value: string) {
	settings[key] = value;
}

export function resetSetting(key: SettingKey) {
	settings[key] = DEFAULT_SETTINGS[key];
}

export function resetSettings() {
	for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
		settings[key] = value;
	}
}

export function applyTheme(name: keyof typeof THEMES) {
	const theme = THEMES[name];
	if (!theme) {
		console.error(`Theme ${name} not found`);
		return;
	}

	for (const [key, value] of Object.entries(theme.values)) {
		settings[key as SettingKey] = value;
	}
}
