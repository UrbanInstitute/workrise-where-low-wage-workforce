<script>
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { getContext } from "svelte";

  export let ticks;
  export let xScale;

  const { margin, innerHeight } = getContext("chart-constants");
</script>

{#if ticks}
  {#each ticks as tick, i (tick)}
    <g
      animate:flip={{ duration: 1000 }}
      in:fade={{ duration: 500, delay: 500 }}
      out:fade={{ duration: 250 }}
    >
      <line
        x1={xScale(tick)}
        x2={xScale(tick)}
        y1={margin.top}
        y2={innerHeight - 5}
        stroke="black"
        stroke-opacity="0.1"
      />
    </g>
  {/each}
{/if}
