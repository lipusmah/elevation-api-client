<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from './Icon.svelte';

	export let icon: string | null = null;
	export let active: boolean = false;
	export let text: string | null = null;
	export let disabled = false;
	export let kind: 'primary' | 'secondary' | 'danger' | 'ghost' | 'ghost-alt' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let tooltip: string | null = null;

	const dispatch = createEventDispatcher();
	function onClick() {
		dispatch('click');
	}

	const btnClass = icon && !text ? 'btn__icon' : 'btn';
	const iconClass = icon && !text ? 'icon-only' : 'icon';
	$: activeCss = active ? 'active' : '';
</script>

<button
	class={`button ${btnClass} ${activeCss} ${size} ${kind} ${disabled ? 'disabled' : ''}`}
	{type}
	title={tooltip}
	{disabled}
	on:click={onClick}
>
	{#if icon && !text}
		<div class={iconClass}>
			<Icon {icon} />
		</div>
	{/if}
	{#if text}
		{#if icon}
			<Icon {icon} />
		{/if}
		<div>
			{text}
		</div>
	{/if}
</button>

<style lang="scss">
	.ghost {
		color: var(--color-text);
		background-color: transparent;
		& :global(svg path) {
			fill: var(--color-text);
		}
	}
	.ghost-alt {
		color: var(--color-text);
        box-shadow: 2px 3px rgba(0, 0, 0, 0.1);
		& :global(svg path) {
			fill: var(--color-text);
		}
	}
	.danger {
		color: var(--color-bg-1);
		background-color: var(--color-danger-1);
		box-shadow: 2px 3px var(--color-text-1);
		& :global(svg path) {
			fill: var(--color-bg-1);
		}
	}
	.primary {
		color: var(--color-bg-1);
		background-color: var(--color-theme-1);
		box-shadow: 3px 3px rgba(0, 0, 0, 0.1);
		& :global(svg path) {
			fill: var(--color-bg-1);
		}
	}
	.secondary {
		color: var(--color-text);
		background-color: var(--color-theme-2);
		box-shadow: 3px 3px rgba(0, 0, 0, 0.1);
		& :global(svg path) {
			fill: var(--color-text);
		}
	}
	.button {
		width: fit-content;
		border: none;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		border-radius: var(--border-radius-sm);

		& :global(svg) {
			width: 24px;
			height: 24px;
		}
		&:hover {
			background-image: linear-gradient(rgb(0 0 0/30%) 0 0);
			box-shadow: 1px 2px rgba(0, 0, 0, 0.1);
		}
	}
	.btn {
		// width: auto;
	}
	.btn__icon {
		// width: fit-content;
		width: 2.5rem;
		height: 2.5rem;
		&.sm {
			width: 2.25rem;
			height: 2.25rem;
		}
	}
	.icon {
		padding: 0.25rem;
	}
	.icon-only {
		width: 2rem;
		height: 2rem;
		padding: 0.25rem;
		& :global(svg) {
			width: 32px;
			height: 32px;
		}
	}
	.disabled {
		cursor: not-allowed;
		box-shadow: none;
		pointer-events: none;
		background-image: linear-gradient(rgba(102, 101, 101, 0.5) 0 0);
		box-shadow: 1px 2px rgba(0, 0, 0, 0.1);
	}
	.active {
		background-color: lightgray;
	}
	.sm {
		padding: 0 0.5rem 0 0.5rem;
	}
	.md {
		padding: 0.5rem 1rem 0.5rem 1rem;
	}
	.lg {
		padding: 1rem 1.5rem 1rem 1.5rem;
	}
</style>
