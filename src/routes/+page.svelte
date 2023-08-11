<script lang="ts">
	import Button from "$lib/components/Button.svelte";
    import Map from "$lib/components/Map.svelte";
	import { setupMap } from "$lib/stores/map";
	import { MetadataService } from "$lib/api";
    import pinIcon from "$lib/assets/icons/pin.svg";
    import linechartIcon from "$lib/assets/icons/line-chart.svg";
	import { goto } from "$app/navigation";
	import { Feature, View } from "ol";
	import { fromLonLat } from "ol/proj";
	import { extend } from "ol/extent";
	import VectorLayer from "ol/layer/Vector";
	import VectorSource from "ol/source/Vector";
	import { fromExtent } from "ol/geom/Polygon";
	import Style from "ol/style/Style";
	import Stroke from "ol/style/Stroke";

    let map = setupMap();
    const layer = new VectorLayer({source: new VectorSource(), style: new Style({
        stroke: new Stroke({
            color: "black",
            width: 1
        })
    })});
    MetadataService.datasourcesMetadataDatasourcesGet().then(res => {
        if (map && res.length > 0){
            let extent = res[0].extent;
            const s = layer.getSource();
            s?.addFeature(new Feature(fromExtent(extent)));
            
            for (let i=1; i<res.length; i++){
                const ds = res[i];
                extent = extend(extent, ds.extent);
                s?.addFeature(new Feature(fromExtent(ds.extent)));
            };

            const view = new View({
                center: fromLonLat([14.8, 45.9]),
                zoom: 2,
                extent: extent
            })

            map.setView(view);
            map.addLayer(layer);
        }
    })
</script>

<Map map={map}>
    <div class="add">
        <Button icon={pinIcon} text="Get elevation" on:click={() => goto("/elevation")}></Button>
        <Button icon={linechartIcon} text="Get profile" on:click={() => goto("/profile")}></Button>
    </div>
</Map>  

<style>
    .add{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        position: absolute;
        z-index: 3;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
    }
</style>