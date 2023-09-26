<script>
  import {
    currentState,
    currentStateData,
    currentStateRange,
  } from "../../stores/currentState";
  import { currentPUMA, currentPUMAData } from "../../stores/currentPUMA";
  import { metricToggleData } from "../../stores/metricToggle";
  import { scaleLinear } from "d3-scale";
  import Bar from "./Bar.svelte";
  import Axis from "./Axis.svelte";
  import NationalLine from "./NationalLine.svelte";
  import StateRange from "./StateRange.svelte";
  import LongTicks from "./LongTicks.svelte";
  import { setContext } from "svelte";

  export let offsetWidth;

  $: isNotCompact = offsetWidth > 700;

  let width = 800;
  let height = 150;
  let margin = { top: 33, right: 15, bottom: 50, left: 2 };
  let innerHeight = height - margin.bottom;

  $: setContext("chart-constants", {
    margin,
    innerHeight,
  });

  // define domain and ticks
  $: domain = $metricToggleData.domain;
  $: ticks = $metricToggleData.ticks;

  // dynamic domain and ticks
  $: {
    // if current puma goes outside the domain (min or max), expand domain
    // else, use original domain
    if ($currentPUMAData) {
      if (
        $currentPUMAData.value >= $metricToggleData.domain[1] ||
        $currentPUMAData.value <= $metricToggleData.domain[0]
      ) {
        domain = $metricToggleData.expandedDomain;
        ticks = $metricToggleData.expandedTicks;
      } else {
        domain = $metricToggleData.domain;
        ticks = $metricToggleData.ticks;
      }
      // in case puma is not defined, set domain and ticks to original
    }

    if (
      $currentStateRange[0] < $metricToggleData.domain[0] ||
      $currentStateRange[1] > $metricToggleData.domain[1]
    ) {
      domain = $metricToggleData.expandedDomain;
      ticks = $metricToggleData.expandedTicks;
    } else {
      domain = $metricToggleData.domain;
      ticks = $metricToggleData.ticks;
    }
  }

  // define xScale based on domain data and range (width/margins)
  $: xScale = scaleLinear()
    .domain(domain)
    .range([margin.left, width - margin.right]);

  // define barWidth
  $: barWidth = Math.max(width / 70, 8);
</script>

{#if isNotCompact}
  <div id="indicator-chart" bind:clientWidth={width}>
    <svg {width} aria-hidden="true">
      <!-- national line -->
      <NationalLine {xScale} />
      <!-- large ticks (behind all original axis component) -->
      <LongTicks {ticks} {xScale} />
      <!-- state range under axis -->
      <StateRange {xScale} />
      <!-- state bar -->
      {#if $currentState}
        <Bar
          xValue={xScale($currentStateData.value)}
          label={$currentStateData.abbr}
          color={$metricToggleData.scaleFun($currentStateData.value)}
          class="state-group"
          {barWidth}
        />
      {/if}
      <!-- puma bar -->
      {#if $currentPUMA}
        <Bar
          xValue={xScale($currentPUMAData.value)}
          label="PUMA"
          color={$metricToggleData.scaleFun($currentPUMAData.value)}
          class="puma-group"
          {barWidth}
        />
      {/if}
      <!-- axis -->
      <Axis {xScale} {ticks} {domain} />
      <!-- color bar (currently not in use) -->
      <!-- <ColorBar {xScale} {width} {innerHeight} /> -->
    </svg>
  </div>
{/if}

<style>
  #indicator-chart {
    margin: 1rem 0;
    width: 100%;
    height: 150px;
    color: var(--color-wr-dark-blue);
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: bold;
    font-size: 2.5rem;
  }
</style>
