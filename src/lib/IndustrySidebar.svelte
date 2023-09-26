<script>
  import { currentStateData } from "../stores/currentState";
  import { currentPUMAData } from "../stores/currentPUMA";
  import industryLookupData from "../data/industry-lookup.json";
  import nationalData from "../data/national-data.json";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { afterUpdate, onMount } from "svelte";

  let clientWidth;
  let initCount = 0;

  // create sidebar title
  let sidebarTitle = "";
  $: {
    if ($currentStateData) {
      sidebarTitle = $currentStateData.name;
    }
    if ($currentPUMAData) {
      sidebarTitle = $currentPUMAData.name;
    }
    if (!$currentStateData && !$currentPUMAData) {
      sidebarTitle = "National";
    }
  }

  // create sidebar values (list items)
  let sidebarData = [];

  // function to get industries based on id
  const getIndustryVals = (currentData) => {
    [1, 2, 3].map((i, e) => {
      industryLookupData.map((d) => {
        if (d.indnaics === currentData["ind" + i]) {
          sidebarData[e] = {
            ind: d.industry,
            id: currentData["ind" + i],
            num: currentData["concentration" + i],
          };
        }
      });
    });
  };

  $: {
    // prioritize puma data over state
    if ($currentStateData) {
      getIndustryVals($currentStateData);
    }
    if ($currentPUMAData) {
      getIndustryVals($currentPUMAData);
    }
    if (!$currentStateData && !$currentPUMAData) {
      getIndustryVals(nationalData);
    }
  }

  $: heights = {
    val1: 48,
    val2: 48,
    val3: 48,
  };

  $: elList = {
    val1: null,
    val2: null,
    val3: null,
  };

  // adjust height of vals based on clientHeight
  // use querySelector as a fallback
  function adjustHeights() {
    [...Array(3 + 1).keys()].slice(1).map((i) => {
      let valHeight = document.querySelector(
        `.column .value:nth-child(${i})`
      ).clientHeight;
      if (elList["val" + i])
        heights["val" + i] = elList["val" + i].clientHeight;
      else if (valHeight >= 24) {
        heights["val" + i] = valHeight;
      } else {
        heights["val" + i] = 48;
      }
    });
    initCount++;
  }

  // using lifecycle methods to make sure this is definitely updated
  // sometimes resulted in buggy heights when using only bind:clientHeight
  onMount(() => {
    adjustHeights();
  });

  afterUpdate(() => {
    if (initCount > 1) {
      adjustHeights();
    }
  });

  $: if (clientWidth) {
    adjustHeights();
  }
</script>

<div class="sidebar-container" bind:clientWidth>
  <div class="header-container">
    <div class="header-title">Industries with Highest Low-Wage Share</div>
    <div class="header-location">{`(${sidebarTitle})`}</div>
  </div>

  <div class="main-container">
    <div class="column">
      {#each [1, 2, 3] as d}
        <div
          class="integer"
          style:height={heights ? heights["val" + d] + "px" : "48px"}
          aria-hidden="true"
        >
          <span>{d}</span>
        </div>
      {/each}
    </div>

    <div class="column">
      {#each sidebarData as d, i (d.id)}
        {@const spanValue = `${d.ind} (${Math.round(d.num * 100)}%)`}
        <div
          bind:clientHeight={heights["val" + (i + 1)]}
          class="value"
          animate:flip={{ duration: 500 }}
          in:fade={{ duration: 500, delay: 500 }}
          out:fade={{ duration: 250, delay: 0 }}
          bind:this={elList["val" + (i + 1)]}
          aria-label={`${i + 1}. ${d.ind}, ${Math.round(d.num * 100)}%`}
          role="text"
        >
          <span aria-hidden="true">{spanValue}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* parent container */
  .sidebar-container {
    background-color: var(--color-wr-blue);
    padding: 2rem 1.25rem 2rem 1.25rem;
    height: fit-content;
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
  }

  /* header */
  .header-title {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.75rem;
    padding-bottom: 1rem;
  }

  .header-location {
    font-style: italic;
    font-family: var(--font-family-serif);
  }

  /* main content */
  .main-container {
    padding-top: 1rem;
    display: flex;
    column-gap: 0.75rem;
    font-family: var(--font-family-serif);
    width: 100%;
  }

  .main-container .column {
    display: flex;
    flex-direction: column;
    row-gap: 1.25rem;
  }

  .main-container .integer {
    font-weight: bold;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    height: 48px;
  }

  .main-container .value {
    display: flex;
    align-items: center;
  }
</style>
