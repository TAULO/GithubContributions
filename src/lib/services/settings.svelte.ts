export const SettingKey = {
	// Colors
	PRIMARY: '--primary-color',
	SECONDARY: '--secondary-color',
	TERTIARY: '--tertiary-color',
	SUB_TITLE: '--sub-title-color',
	HOVER: '--hover-color',
	// Contribution Levels
	GH_LEVEL_0: '--gh-level-0',
	GH_LEVEL_1: '--gh-level-1',
	GH_LEVEL_2: '--gh-level-2',
	GH_LEVEL_3: '--gh-level-3',
	GH_LEVEL_4: '--gh-level-4',
} as const;

export type SettingKey = (typeof SettingKey)[keyof typeof SettingKey];

export interface ISetting {
	key: SettingKey;
	label: string;
	type: 'color' | 'size' | 'select';
	defaultValue: string;
}

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
		key: '--sub-title-color',
		label: 'Sub Title Color',
		type: 'color',
		defaultValue: DEFAULT_SETTINGS['--sub-title-color'],
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
