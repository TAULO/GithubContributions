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
	import {
		type ISetting,
		type ITheme,
		THEME_NAMES,
		type ThemeName,
	} from '$lib/services/settings/types';
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

{#snippet colorPicker(setting: ISetting)}
	<div class="color-picker-container">
		<h3>{setting.label}</h3>
		<div class="colors-container">
			{#each colors as color}
				<button
					class="color"
					style:background-color={color}
					onclick={() => setSetting(setting.key, color)}
					aria-label={`Set ${setting.label} to ${color}`}
				>
				</button>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet theme(key: String, theme: ITheme)}
	{@const selected = activeTheme === key}
	<div
		class="theme-container"
		class:selected
		style={Object.entries(theme.values)
			.map(([k, v]) => `${k}: ${v}`)
			.join('; ')}
		role="radio"
		aria-checked={selected}
		tabindex="0"
		onclick={() => applyActiveTheme(key)}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && applyActiveTheme(key)}
	>
		<div class="preview"><CalendarPreview /></div>
		<div class="name-container">
			<div class="theme-checkbox" class:selected></div>
			<h3>{theme.label}</h3>
		</div>
	</div>
{/snippet}

<div class="settings-container">
	<h1>Themes</h1>
	<div class="theme-container">
		{#each Object.entries(THEMES) as [name, themeItem]}
			{@render theme(name, themeItem)}
		{/each}
	</div>
</div>

<h1>Settings</h1>
{#each SETTINGS_SCHEMA as setting}
	{#if setting.type === 'color'}
		{@render colorPicker(setting)}
	{/if}
{/each}
<div></div>

<style>
	h1 {
		color: white;
	}

	.settings-container {
		display: flex;
		flex-direction: column;
	}

	.color-picker-container {
		display: flex;
		justify-content: space-between;

		.colors-container {
			display: flex;
			gap: var(--space-2);

			.color {
				width: 32px;
				height: 32px;
				border-radius: var(--radius-full);
				box-shadow: var(--shadow);
				border: none;
			}
		}
	}

	.theme-container {
		display: flex;
		gap: var(--space-4);
		flex-wrap: wrap;

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

			border-radius: var(--radius-lg);
			border: 1px solid var(--border);
			box-shadow: var(--shadow);
			background-color: var(--primary-color);

			.preview {
				border-radius: var(--radius-lg);
				margin: var(--space-4);

				justify-self: center;
				align-self: center;
			}

			.name-container {
				display: flex;
				gap: var(--space-2);

				align-items: center;

				h3 {
					color: var(--text-primary);
				}

				.theme-checkbox {
					display: flex;
					justify-content: center;
					align-items: center;

					width: 16px;
					height: 16px;
					border-radius: var(--radius-full);
					border: 1px solid var(--tertiary-color);
					margin-left: var(--space-4);
				}

				.theme-checkbox.selected {
					background-color: var(--tertiary-color);
				}
			}
		}
	}
</style>
