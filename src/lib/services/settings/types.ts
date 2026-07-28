export type SettingKey = (typeof SettingKey)[keyof typeof SettingKey];

export interface ISetting {
	key: SettingKey;
	label: string;
	type: 'color';
	defaultValue: string;
}

export interface ITheme {
	label: string;
	values: Record<SettingKey, string>;
}

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

export const THEME_NAMES = {
	Default: 'default',
	Halloween: 'halloween',
	Dracula: 'dracula',
	Ocean: 'ocean',
	Monochrome: 'monochrome',
	Matrix: 'matrix',
} as const;

export type ThemeName = (typeof THEME_NAMES)[keyof typeof THEME_NAMES];
