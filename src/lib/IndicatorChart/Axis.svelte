<script>
  import { metricToggleData } from "../../stores/metricToggle";
  import { getContext } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";

  export let xScale;
  export let ticks;
  export let domain;

  const { innerHeight } = getContext("chart-constants");

  // determine anchor of tick label
  const textAnchor = (i, ticks) => {
    if (i === 0) return "left";
    if (i === ticks.length) return "right";
    return "middle";
  };
</script>

<g class="x-axis" aria-hidden="true">
  <!-- axis line -->
  <g class="indicator-line">
    <line
      x1={xScale(domain[0])}
      x2={xScale(domain[1])}
      y1={innerHeight - 5}
      y2={innerHeight - 5}
      stroke="black"
      stroke-width="1"
    />
  </g>
  <!-- ticks -->
  {#if ticks}
    {#each ticks as tick, i (tick)}
      <g
        animate:flip={{ duration: 1000 }}
        in:fade={{ duration: 650, delay: 500 }}
        out:fade={{ duration: 250 }}
      >
        <!-- tick line -->
        <line
          x1={xScale(tick)}
          x2={xScale(tick)}
          y1={innerHeight}
          y2={innerHeight - 5}
          stroke="black"
        />
        <!-- tick label -->
        <text
          x={xScale(tick)}
          y={innerHeight + 15}
          text-anchor={textAnchor(i, ticks)}
          font-size="0.9375rem"
          fill="black"
        >
          {$metricToggleData.tickFormatFun(tick)}
        </text>
      </g>
    {/each}
  {/if}
</g>
