<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import { setupMap, map } from '$lib/stores/map';
	import { onDestroy, onMount } from 'svelte';
	import { Draw } from 'ol/interaction';
	import VectorSource from 'ol/source/Vector';
	import { GeometryService, type ElevationProfile } from '$lib/api';
	import Button from '$lib/components/Button.svelte';
	import backIcon from '$lib/assets/icons/back.svg';
	import { GeoJSON } from 'ol/format';
	import pinIcon from '$lib/assets/icons/pin.svg';
	import refreshIcon from '$lib/assets/icons/refresh.svg';

	import VectorLayer from 'ol/layer/Vector';
	import Style from 'ol/style/Style';
	import Icon from 'ol/style/Icon';

	import { Feature } from 'ol';
	import { Point, LineString } from 'ol/geom';
	import Stroke from 'ol/style/Stroke';
	import ElevationChart from '$lib/components/ElevationChart.svelte';
	import { lineStyle, pinStyle } from '$lib/utils/ol-style';

	let olMap = $map ?? setupMap();
	let profile: ElevationProfile;
	const layer = new VectorLayer({
		source: new VectorSource(),
		style: lineStyle
	});
	const hoverLayer = new VectorLayer({
		source: new VectorSource(),
		style: pinStyle
	});
	let interpolate = 10;
	let drawing = false;
	let geom: LineString;
	const draw = new Draw({
		source: new VectorSource(),
		type: 'LineString'
	});

	draw.on('drawend', async (ev) => {
		await handleDrawend(ev.feature);
		drawing = false;
	});
	draw.on('drawstart', async (ev) => {
		geom = <LineString>ev.feature.getGeometry();
		if (geom.getCoordinates().length > 0) {
			drawing = true;
		}
	});
	let message: string | null = 'Click on map to start drawing';

	onMount(() => {
		olMap.addInteraction(draw);
		olMap.addLayer(layer);
		olMap.addLayer(hoverLayer);
		olMap.getViewport().style.cursor = 'crosshair';

	});
	const reset = () => {
		layer.getSource()?.clear();
		olMap.addInteraction(draw);
		profile = null;
		olMap.getViewport().style.cursor = 'crosshair';
		message = 'Click on map to get elevation';
	};

	const handleDrawend = async (feature: Feature) => {
		geom = <LineString>feature.getGeometry();
		interpolate = Math.floor(geom.getLength() / 100);
		const geojson = new GeoJSON();
		GeometryService.elevationProfile(JSON.parse(geojson.writeGeometry(geom)), interpolate)
			.then((res) => {
				if (res == null) {
					message = 'No elevation data for location. Click on map to get elevation.';
					return;
				}
				profile = res;
				const s = layer.getSource();
				const f = new Feature(new LineString(profile.geometry.coordinates));
				s?.clear();
				s?.addFeature(f);
				message = null;
				olMap.getViewport().style.cursor = 'auto';
				olMap.removeInteraction(draw);
				setTimeout(() => {
					olMap.getView().fit(s?.getExtent(), { padding:[20, 20, 20, 20], duration: 1000});
				}, 50);
			})
			.catch((err) => {
				message = 'Error loading data';
			});
	};
	onDestroy(() => {
		if (draw && olMap) {
			olMap.removeInteraction(draw);
		}
		if (layer && olMap) {
			olMap.removeLayer(layer);
			olMap.removeLayer(hoverLayer);
		}
	});
	const onHover = (ev: {detail: number}) => {
		const coord = profile.geometry.coordinates[ev.detail];
		const point = new Feature(new Point(coord));
		hoverLayer.getSource()?.clear();
		hoverLayer.getSource()?.addFeature(point);
	};
	const onUnhover = (_: CustomEvent) => {
		hoverLayer.getSource()?.clear();
	};
</script>

<div class="page">
	<div class="map">
		<Map map={olMap}>
			<div class="back-button">
				<Button kind="primary" size="sm" icon={backIcon} on:click={() => history.back()}>
					{message}
				</Button>
			</div>

			{#if message}
				<div class="info-message">
					<!-- <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem">
                        <div>Interpolate:</div>
                        <input type="number" bind:value={interpolate} step={0.1} min={0}>
                    </div> -->
					{#if drawing}
						<div class="control">
							<Button
								kind="primary"
								size="md"
								text="Finish drawing"
								on:click={() => draw.finishDrawing()}
							/>
						</div>
					{:else}
						<div class="text">
							{message}
						</div>
					{/if}
				</div>
			{/if}
		</Map>
	</div>
	{#if profile}
		<div class="info">
			<div class="top-row">
				<Button kind="ghost" size="md" icon={refreshIcon} on:click={reset} />
			</div>
			<div class="profile">
				<ElevationChart {profile} on:hover={onHover} on:unhover={onUnhover} />
			</div>
			<div class="stats">
				<div class="row">
					<div class="title">max:</div>
					<div class="value">{profile.max.toFixed(2)} m</div>
				</div>
				<div class="row">
					<div class="title">min:</div>
					<div class="value">{profile.min.toFixed(2)} m</div>
				</div>
				<div class="row">
					<div class="title">gain:</div>
					<div class="value">{profile.gain.toFixed(2)} m</div>
				</div>
				<div class="row">
					<div class="title">loss:</div>
					<div class="value">{profile.loss.toFixed(2)} m</div>
				</div>
			</div>
		</div>
	{/if}
</div>

{#if profile}
	<!-- content here -->
{/if}

<style lang="scss">
	.top-row{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
	input[type='number'] {
		padding: 0.5rem 1rem;
		width: 4rem;
		border-radius: var(--border-radius-sm);
		border: 1px solid black;
	}
	.stats {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1rem;
		.row {
			display: flex;
			flex-direction: row;
			padding: 0.5rem;
			border-bottom: 1px solid var(--color-text-2);
			.title {
				flex: 1;
				font-weight: bold;
			}
			.value {
				flex: 1;
			}
		}
	}
	.profile {
		max-width: 99%;
	}
	.page {
		height: 100%;
		display: flex;
		flex-direction: column;
		.map {
			flex: 1;
			height: 100%;
		}
		.info {
			height: 50%;
		}
	}
	.back-button {
		z-index: 2;
		position: absolute;
		left: 1rem;
		top: 1rem;
	}
	.control {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.info-message {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		min-width: 20rem;
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
