<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import { setupMap, map } from '$lib/stores/map';
	import { onDestroy, onMount } from 'svelte';
	import { Draw } from 'ol/interaction';
	import VectorSource from 'ol/source/Vector';
	import { ElevationService } from '$lib/api';
	import Button from '$lib/components/Button.svelte';
	import backIcon from '$lib/assets/icons/back.svg';

	import pinIcon from '$lib/assets/icons/pin.svg';
	import refreshIcon from '$lib/assets/icons/refresh.svg';

	import VectorLayer from 'ol/layer/Vector';
	import Style from 'ol/style/Style';
	import Icon from 'ol/style/Icon';
	import Circle from 'ol/style/Circle';

	import type { Feature } from 'ol';
	import Fill from 'ol/style/Fill';
	import type { Point } from 'ol/geom';
	import Stroke from 'ol/style/Stroke';
	import { drawStyle, pinStyle } from '$lib/utils/ol-style';

	let olMap = $map ?? setupMap();
	let draw: Draw;
	let layer = new VectorLayer({
		source: new VectorSource(),
		style: pinStyle
	});
	draw = new Draw({
		source: new VectorSource(),
		type: 'Point',
		style: drawStyle
	});
	draw.on('drawend', async (ev) => {
		await handleClick(ev.feature);
	});

	let message = 'Click on map to get elevation';

	onMount(() => {
		olMap.addInteraction(draw);
		olMap.addLayer(layer);
		olMap.getViewport().style.cursor = 'crosshair';
	});
	const reset = () => {
		layer.getSource()?.clear();
		olMap.addInteraction(draw);
		olMap.getViewport().style.cursor = 'crosshair';
		message = 'Click on map to get elevation';
	};
	const handleClick = async (feature: Feature) => {
		const coords = (<Point>feature.getGeometry()).getCoordinates();
		ElevationService.getElevation(coords[0], coords[1])
			.then((res) => {
				if (res == null) {
					message = 'No elevation data for location. Click on map to get elevation.';
					return;
				}
				const s = layer.getSource();
				s?.clear();
				s?.addFeature(feature);
				message = res.toFixed(2) + ' m';
				olMap.getViewport().style.cursor = 'auto';
				olMap.removeInteraction(draw);
				setTimeout(() => {
					olMap.getView().fit(s?.getExtent(), { maxZoom: 14, duration: 1000 });
				}, 10);
			})
			.catch((err) => (message = 'Error loading data'));
	};
	onDestroy(() => {
		if (draw && olMap) {
			olMap.removeInteraction(draw);
		}
		if (layer && olMap) {
			olMap.removeLayer(layer);
		}
	});
</script>

<Map map={olMap}>
	<div class="back-button">
		<Button kind="primary" size="sm" icon={backIcon} on:click={() => history.back()}>
			{message}
		</Button>
	</div>

	<div class="info">
		<div class="text">
			{message}
		</div>

		<Button kind="primary" size="sm" icon={refreshIcon} on:click={reset}>
			{message}
		</Button>
	</div>
</Map>

<style>
	.back-button {
		z-index: 2;
		position: absolute;
		left: 1rem;
		top: 1rem;
	}
	.info {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		min-width: 75%;
		gap: 1rem;
		align-items: center;
		position: absolute;
		bottom: 3rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		background-color: var(--color-bg-1);
		border-radius: var(--border-radius-sm);
		padding: 1rem 1.5rem;
	}
	.text {
		font-size: larger;
		font-weight: bold;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
