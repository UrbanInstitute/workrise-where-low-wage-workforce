<script>
  // components
  import Toggle from "./lib/Toggle.svelte";
  import IndicatorMetrics from "./lib/IndicatorMetrics.svelte";
  import IndicatorChart from "./lib/IndicatorChart/Chart.svelte";
  import Map from "./lib/Map/Map.svelte";
  import IndustrySidebar from "./lib/IndustrySidebar.svelte";
  import DropdownSection from "./lib/DropdownSection.svelte";

  let offsetWidth;
</script>

<main bind:offsetWidth>
  <Toggle />
  <br />
  <DropdownSection />
  <br />
  <IndicatorMetrics />
  <IndicatorChart {offsetWidth} />
  <div id="map-sidebar-container">
    <div id="map-parent">
      <Map />
    </div>
    <div id="sidebar-parent">
      <IndustrySidebar />
    </div>
  </div>
</main>

<style>
  main {
    background-color: var(--color-gray-shade-lightest);
    max-width: 1595px;
    margin: auto;
    justify-self: center;
    padding: 3.5rem 1.25rem 1rem 1.25rem;
  }

  #map-sidebar-container {
    display: grid;
    grid-template-columns: 72.5% 25%;
    grid-template-rows: 100%;
    grid-column-gap: 2.5%;
  }

  #map-parent {
    width: 100%;
    min-height: 200px;
  }

  /* lg (1056px) */
  @media (max-width: 1056px) {
    #map-sidebar-container {
      grid-template-columns: 67.5% 30%;
      grid-column-gap: 2.5%;
    }

    main {
      padding-top: 2rem;
    }
  }

  /* md (798px) */
  @media (max-width: 798px) {
    #map-sidebar-container {
      display: block;
      grid-template-columns: auto;
      grid-template-columns: auto;
    }

    #map-sidebar-container div {
      grid-column: auto;
      grid-row: auto;
    }

    #sidebar-parent {
      padding-top: 2rem;
    }
  }
</style>
