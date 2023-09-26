<script>
  import { flip } from "svelte/animate";
  import { getContext } from "svelte";
  import { metricToggleData } from "../../stores/metricToggle";
  export let xScale;

  const { innerHeight } = getContext("chart-constants");
</script>

{#each [0] as number (number)}
  <g animate:flip={{ duration: 1000 }} aria-hidden="true">
    <!-- national line -->
    <line
      x1={xScale($metricToggleData.national)}
      x2={xScale($metricToggleData.national)}
      y1={innerHeight - 5}
      y2={0}
      stroke="var(--color-gray-shade-darker)"
      stroke-dasharray="5,5"
      stroke-width="2"
    />
    <!-- national text -->
    <text
      x={xScale($metricToggleData.national) + 17}
      y={12}
      text-anchor="middle"
      font-size="0.9375rem"
      fill="var(--color-gray-shade-darker)">USA</text
    >
  </g>
{/each}
