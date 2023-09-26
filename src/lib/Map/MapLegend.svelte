<script>
  import { metricToggle, metricToggleData } from "../../stores/metricToggle";

  // create legend using the legend domain in metricToggleData
  $: legendData = $metricToggleData.legendDomain.map((d, i) => {
    return {
      label: $metricToggleData.legendFormatFun(d),
      color: $metricToggleData.colorRange[i],
    };
  });

  // define vars to use as size reference
  let clientWidth;
  let isMobile;
  let barWidth;
  $: {
    isMobile = clientWidth < 376;
    barWidth = isMobile ? 50 : 60;
  }
</script>

<div class="legend" bind:clientWidth>
  <svg width="400px" height="48px" aria-hidden="true">
    {#each legendData as d, i}
      <g>
        <!-- rect -->
        <rect
          x={barWidth * i + ($metricToggle ? 26 : 18)}
          y="1"
          width={barWidth}
          height="22"
          fill={d.color}
        />
        <!-- text -->
        <text
          x={barWidth * i + ($metricToggle ? 24 : 20)}
          y="40"
          font-size={isMobile ? "0.75rem" : "0.875rem"}
          font-weight="500"
          text-anchor="middle">{d.label}</text
        >
      </g>
    {/each}
    <!-- stroke entire legend -->
    <rect
      x={$metricToggle ? 26 : 18}
      y="1"
      height="22px"
      width={barWidth * 6}
      fill="none"
      stroke="var(--color-gray-shade-darker)"
      stroke-width="1"
    />
  </svg>
</div>

<style>
  .legend {
    overflow: hidden;
  }
</style>
