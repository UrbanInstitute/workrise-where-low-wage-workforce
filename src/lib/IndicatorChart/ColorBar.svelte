<script>
  import { metricToggleData } from "../../stores/metricToggle";
  export let xScale;
  export let width;
  export let innerHeight;

  $: arr = [
    $metricToggleData.domain[0],
    ...$metricToggleData.colorDomain,
    $metricToggleData.domain[1],
  ];
</script>

<g>
  {#each arr as d, i}
    <line
      x1={xScale(arr[i - 1] ?? arr[0]) - 1}
      x2={xScale(arr[i]) + 1}
      y1={innerHeight - 1}
      y2={innerHeight - 1}
      stroke-width="10"
      stroke={$metricToggleData.scaleFun(d)}
    />
  {/each}
</g>
