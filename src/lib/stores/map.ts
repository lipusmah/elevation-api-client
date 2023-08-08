import { View, Map } from "ol";
import TileLayer from "ol/layer/Tile";
import { get, writable, type Writable } from "svelte/store";
import OSM from 'ol/source/OSM';
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from 'ol/control/defaults';
import { defaults as defaultInteractions } from 'ol/interaction/defaults';

export let map: Writable<Map> = writable();

export function setupMap() {
    if (get(map)){
        return get(map);
    }
    const tiles = new TileLayer({
        source: new OSM()
    });
    const view = new View({
        center: fromLonLat([14.8, 45.9]),
        zoom: 9,
    })
    const olmap = new Map({
        view: view,
        layers: [tiles],
        controls: defaultControls({rotate: false, zoom: false, attribution: false}),
    })

    // olmap.getViewport().style.cursor = "-webkit-grab";
    // olmap.on('pointerdrag', function (evt) {
    //     olmap.getViewport().style.cursor = "-webkit-grabbing";
    // });

    // olmap.on("pointermove", function (evt) {
    //     olmap.getViewport().style.cursor = "-webkit-grab";
    // });
    map.set(olmap);
    return get(map);
}


