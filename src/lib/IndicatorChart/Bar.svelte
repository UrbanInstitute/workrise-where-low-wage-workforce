<script>
  import { getContext } from "svelte";
  import { flip } from "svelte/animate";
  import { fade, fly } from "svelte/transition";

  export let xValue;
  export let label;
  export let color;
  export let barWidth;

  const { margin, innerHeight } = getContext("chart-constants");

  // determine width of text background
  $: rectWidth = $$props.class == "state-group" ? 7 : 30;
</script>

<g
  class={$$props.class}
  in:fly={{ x: -200, duration: 1000 }}
  out:fade={{ duration: 500 }}
  aria-hidden="true"
>
  <!-- each for animate:flip to work -->
  {#each [0] as number (number)}
    <g animate:flip={{ duration: 1000 }}>
      <!-- background rect for text -->
      <rect
        x={xValue - barWidth / 2 - rectWidth / 2}
        y={margin.top - 15}
        width={barWidth + rectWidth}
        height="16px"
        rx="2"
        fill="var(--color-gray-shade-lightest)"
      />
      <!-- text -->
      <text
        x={xValue}
        y={margin.top - 3}
        text-anchor="middle"
        font-size="0.9375rem"
        font-weight="500"
        fill="black"
        >{label}
      </text>
      <!-- bar -->
      <rect
        transition:fade={{ duration: 1000 }}
        x={xValue - barWidth / 2}
        y={margin.top}
        width={barWidth}
        height={innerHeight - 5 - margin.top}
        fill={color}
        stroke="var(--color-gray-shade-lightest)"
        stroke-width="2"
      />
    </g>
  {/each}
</g>
