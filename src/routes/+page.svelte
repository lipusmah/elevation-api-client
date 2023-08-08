<script lang="ts">
	import Button from "$lib/components/Button.svelte";
    import Map from "$lib/components/Map.svelte";
	import { setupMap } from "$lib/stores/map";
	import { MetadataService } from "$lib/api";
    import pinIcon from "$lib/assets/icons/pin.svg";
    import linechartIcon from "$lib/assets/icons/line-chart.svg";
	import { goto } from "$app/navigation";

    MetadataService.datasourcesMetadataDatasourcesGet().then(res => {
        console.log(res);
    })
</script>

<Map map={setupMap()}>
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