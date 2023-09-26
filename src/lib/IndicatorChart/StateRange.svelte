<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import {
    currentState,
    currentStateData,
    currentStateRange,
  } from "../../stores/currentState";
  import { getContext } from "svelte";

  export let xScale;
  const { innerHeight } = getContext("chart-constants");

  // tweened position
  const xPos = tweened(0, {
    duration: 1000,
    easing: cubicOut,
  });

  // tweened width
  const xWidth = tweened(0, {
    duration: 1000,
    easing: cubicOut,
  });

  // set tween on value change
  $: {
    xWidth.set(xScale($currentStateRange[1]) - xScale($currentStateRange[0]));
    xPos.set(xScale($currentStateRange[0]));
  }
</script>

<!-- text -->
{#if $currentState}
  <text
    x={$xPos}
    y={innerHeight + 40}
    text-anchor="left"
    font-weight="300"
    font-size="0.875rem"
    fill="var(--color-gray-shade-darkest)"
    fill-opacity="1"
  >
    {$currentStateData.abbr} RANGE</text
  >
{/if}

<!-- background rect -->
{#if $currentState}
  <rect
    x={$xPos}
    y={innerHeight - 5}
    width={$xWidth}
    height="30"
    fill="black"
    fill-opacity="0.1"
  />
{/if}
