<script>
  import MapLegend from "./MapLegend.svelte";
  import { onMount } from "svelte";
  import "../../../node_modules/mapbox-gl/dist/mapbox-gl.css";
  import { logClickToGA } from "../../analytics";

  // stores
  import { newMapStore, mapStore } from "../../stores/map";
  import { currentPUMA, currentPUMAData } from "../../stores/currentPUMA";
  import { metricToggle } from "../../stores/metricToggle";
  import { currentState, currentStateData } from "../../stores/currentState";
  import { get } from "svelte/store";

  // declare map element
  let mapEl;

  // when STATE changes
  $: if ($currentState) {
    // turn off puma outline
    $mapStore.PUMAFilter("999999999");
    // when current state is set, outline it
    $mapStore.stateFilter($currentState);
    // fly to state
    $mapStore.flyToBounds(get(currentStateData));
    // show puma layer
    $mapStore.showPUMALayer(get(metricToggle)); //get doesn't fire reactivity
  }

  // when PUMA changes
  $: if ($currentPUMA) {
    // when current puma is set, outline it
    $mapStore.PUMAFilter($currentPUMA);
    // fly to puma
    $mapStore.flyToBounds(get(currentPUMAData));
  }

  // on mount, initialize and load map
  onMount(() => {
    $mapStore = newMapStore(mapEl);
    $mapStore.onLoad();
  });
</script>

<div id="mapbox-map" bind:this={mapEl} />
<div id="map-footer">
  <MapLegend />
  <!-- if there's a current state or puma, show the "clear selection" text -->
  {#if $currentState || $currentPUMA}
    <div id="clear-selection">
      <span
        role="button"
        aria-label="Clear selection"
        tabindex="0"
        on:click={(e) => {
          $mapStore.resetMap();
          logClickToGA(e.currentTarget, `map--clear`);
        }}
        on:keypress={(e) => {
          $mapStore.resetMap();
          logClickToGA(e.currentTarget, `map--clear`);
        }}>Clear selection</span
      >
    </div>
  {/if}
</div>

<style>
  #mapbox-map {
    width: 100%;
    height: 550px;
  }

  #map-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 1rem;
  }

  #clear-selection {
    text-align: right;
  }

  #clear-selection span {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
    text-underline-offset: 0.25rem;
  }

  /* tooltip*/

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  :global(.mapbox-pointer) {
    font-family: franklin-gothic-urw;
    font-size: 1rem;
    color: var(--color-gray-shade-darkest);
    text-align: center;
    animation: fadeIn 0.25s;
  }

  :global(.mapboxgl-popup-content) {
    border-radius: 0;
    line-height: 1.5rem;
    padding: 0.9375rem !important;
  }

  :global(.popup-name) {
    font-weight: 500;
  }

  :global(.popup-value) {
    font-weight: 600;
  }
</style>
