<script lang="ts">
	import { onMount } from 'svelte';

	export let icon: string;
	let element: HTMLElement;

	const loadIcon = async (path: string) => {
		const iconPath = path;
		return await fetch(iconPath)
			.then((response) => {
				// this is false when server responses are 4xx, 5xx
				if (!response.ok) {
					console.error(`SVG load failed: ${iconPath}`);
				}
				return response.text();
			})
			.catch((error) => {
				// fetch with catch is only hit on network errors (no server response)
				console.log(error);
			});
	};
	onMount(async () => {
		const svgText = await loadIcon(icon);
		if (svgText) {
			element.innerHTML = svgText;
		}
	});
</script>

<div class="icon" bind:this={element} />

<style>
	.icon {
		max-width: 100%;
		max-height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
</style>
