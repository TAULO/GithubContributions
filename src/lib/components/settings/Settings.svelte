<script lang="ts">
	import {
		settings,
		setSetting,
		resetSetting,
		resetSettings,
		SETTINGS_SCHEMA,
	} from '$lib/services/settings/settings.svelte.js';
</script>

<div class="settings">
	<h1>Settings</h1>

	<div class="settings-container">
		{#each SETTINGS_SCHEMA as setting}
			<label class="setting-row">
				<span>{setting.label}</span>
				<button onclick={() => resetSetting(setting.key)}>reset</button>
				{#if setting.type === 'color'}
					<input
						type="color"
						value={settings[setting.key]}
						oninput={(e) => setSetting(setting.key, e.currentTarget.value)}
					/>
				{:else if setting.type === 'size'}
					<input
						type="range"
						min="8"
						max="20"
						value={parseInt(settings[setting.key])}
						oninput={(e) => setSetting(setting.key, `${e.currentTarget.value}px`)}
					/>
				{:else if setting.type === 'select'}
					<!-- select options TBD -->
				{/if}
			</label>
		{/each}
	</div>

	<button onclick={resetSettings}>Reset to defaults</button>
</div>

<style>
	h1 {
		color: white;
	}

	span {
		color: white;
	}

	.settings-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
	}
</style>
