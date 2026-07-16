<div class="loading-container">
	<span class="loader"></span>
</div>

<style>
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loader {
		--color-1: var(--tertiary-color);
		--size: .5px;
		width: calc(48 * var(--size));
		height: calc(48 * var(--size));
		border: calc(5 * var(--size)) solid var(--color-1);
		border-bottom-color: transparent;
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
