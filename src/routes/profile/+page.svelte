<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import { setupMap, map } from '$lib/stores/map';
	import { onDestroy, onMount } from 'svelte';
	import { Draw } from 'ol/interaction';
	import VectorSource from 'ol/source/Vector';
	import { ElevationService, GeometryService, type ElevationProfile } from '$lib/api';
	import Button from '$lib/components/Button.svelte';
	import backIcon from '$lib/assets/icons/back.svg';
	import { GeoJSON } from 'ol/format';
	import pinIcon from '$lib/assets/icons/pin.svg';
	import refreshIcon from '$lib/assets/icons/refresh.svg';

	import VectorLayer from 'ol/layer/Vector';
	import Style from 'ol/style/Style';
	import Icon from 'ol/style/Icon';
	import Circle from 'ol/style/Circle';

	import type { Feature } from 'ol';
	import type { LineString } from 'ol/geom';
	import Stroke from 'ol/style/Stroke';
	import ElevationChart from '$lib/components/ElevationChart.svelte';

	let olMap = $map ?? setupMap();
	let profile: ElevationProfile;
	const layer = new VectorLayer({
		source: new VectorSource(),
		style: [
			new Style({ stroke: new Stroke({ color: 'rgba(255,255,255,1)', width: 5 }) }),
            new Style({ stroke: new Stroke({ color: 'rgba(0,0,0,1)', width: 2 }) }),
		]
	});
    let interpolate = 10;
	const draw = new Draw({
		source: new VectorSource(),
		type: 'LineString'
	});
	draw.on('drawend', async (ev) => {
		await handleDrawend(ev.feature);
	});

	let message: string | null = 'Click on map to start drawing';

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
	const handleDrawend = async (feature: Feature) => {
		const geom = <LineString>feature.getGeometry();
        interpolate = Math.floor(geom.getLength()/100);
		const geojson = new GeoJSON();
		GeometryService.elevationProfile(JSON.parse(geojson.writeGeometry(geom)), interpolate)
			.then((res) => {
				if (res == null) {
					message = 'No elevation data for location. Click on map to get elevation.';
					return;
				}
				profile = res;
				const s = layer.getSource();
				s?.clear();
				s?.addFeature(feature);
				olMap.getView().fit(geom, { padding: [100, 50, 100, 50], duration: 1000 });
				message = null;
				olMap.getViewport().style.cursor = 'auto';
				olMap.removeInteraction(draw);
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
					<div class="text">
						{message}
					</div>

					<Button kind="primary" size="sm" icon={refreshIcon} on:click={reset}>
						{message}
					</Button>
				</div>
			{/if}
		</Map>
	</div>
	{#if profile}
		<div class="info">
            <div class="profile">
                <ElevationChart profile={profile}></ElevationChart>
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
    input[type="number"]{
        padding: 0.5rem 1rem;
        width: 4rem;
        border-radius: var(--border-radius-sm);
        border: 1px solid black;
    }
    .stats{
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 1rem;
        .row{
            display: flex;
            flex-direction: row;
            padding: 0.5rem;
            border-bottom: 1px solid var(--color-text-2);
            .title{
                flex: 1;
                font-weight: bold;
            }
            .value{
                flex: 1;
            }
        }
    }
    .profile{
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
	.info-message {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
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
