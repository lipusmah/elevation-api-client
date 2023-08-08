<script lang="ts">
	import type { Map } from "ol";
	import { onMount } from "svelte";

    export let map: Map;
    let element: HTMLElement;
    let width: number, height: number;
    onMount(() => {
        map?.setTarget(element);
    });
    $: if (height || width){
        map?.render();
    }
</script>

<div class="map" bind:this={element} bind:clientHeight={height} bind:clientWidth={width}>
   <slot></slot>
</div>

<style>
    .map{
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>