<script lang="ts">
	import {
		settings,
		setSetting,
		resetSetting,
		resetSettings,
		SETTINGS_SCHEMA,
		applyTheme,
	} from '$lib/services/settings/settings.svelte.js';

	import { THEMES } from '$lib/services/settings/themes.js';
	import { type ITheme, THEME_NAMES, type ThemeName } from '$lib/services/settings/types';
	import CalendarPreview from '$lib/components/settings/CalendarPreview.svelte';

	const colors = ['black', 'red', 'green', 'blue', 'pink'];

	let activeTheme = $state<String>(THEME_NAMES.Default);

	function applyActiveTheme(key: String) {
		activeTheme = key;
		applyTheme(key as ThemeName);
	}

	function resetThemeSettings() {
		activeTheme = THEME_NAMES.Default;
		resetSettings();
	}
</script>

{#snippet colorPicker()}
	<div class="color-picker-container">
		<div class="colors-container">
			{#each colors as color}
				div.color
			{/each}
		</div>
	</div>
{/snippet}

{#snippet theme(key: String, theme: ITheme)}
	<div
		class="theme-container"
		class:selected={activeTheme === key}
		style={Object.entries(theme.values)
			.map(([k, v]) => `${k}: ${v}`)
			.join('; ')}
		role="radio"
		aria-checked={activeTheme === key}
		tabindex="0"
		onclick={() => applyActiveTheme(key)}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && applyActiveTheme(key)}
	>
		<div class="preview"><CalendarPreview /></div>
		<div class="name-container">
			<h3>{theme.label}</h3>
		</div>
	</div>
{/snippet}

<div class="settings">
	<h1>Settings</h1>

	<div class="settings-container"></div>
	<button onclick={resetThemeSettings}>Reset to defaults</button>

	<div>
		<h1>Themes</h1>
		<div style="display: flex; gap: 16px; flex-wrap: wrap">
			{#each Object.entries(THEMES) as [name, themeItem]}
				{@render theme(name, themeItem)}
			{/each}
		</div>
	</div>
</div>

<style>
	h1 {
		color: white;
	}

	.settings-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
	}

	.theme-container:hover {
		cursor: pointer;
		outline: 1px solid var(--hover-color);
	}

	.theme-container.selected {
		outline: 1px solid var(--tertiary-color);
	}

	.theme-container {
		display: flex;
		flex-direction: column;

		width: fit-content;

		border-radius: 10px;
		box-shadow: var(--shadow);
		background-color: var(--primary-color);

		.preview {
			height: 100%;
			border-radius: 10px;
			margin: 1rem;

			justify-self: center;
			align-self: center;
		}

		.name-container {
			display: flex;
			gap: 8px;

			border-radius: 0 0 10px 10px;

			h3 {
				color: var(--sub-title-color);
				margin-left: 1rem;
			}
		}
	}
</style>
