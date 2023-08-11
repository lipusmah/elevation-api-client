<script lang="ts">
    import "../app.scss";
    import Header from "$lib/components/Header.svelte";
	import { OpenAPI } from "$lib/api";
    OpenAPI.BASE = "https://elevation.lipusblaz.com";
</script>

<div class="layout">
    <div class="header"><Header></Header></div>
    <div class="content">
        <slot></slot>
    </div>
 
</div>
