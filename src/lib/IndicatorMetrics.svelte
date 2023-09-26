<script>
  import { currentState, currentStateData } from "../stores/currentState";
  import { currentPUMA, currentPUMAData } from "../stores/currentPUMA";
  import { metricToggleData } from "../stores/metricToggle";
  export let isCompact = false;

  // change text based on width
  $: clientWidth = 1000;
  $: isCompact = clientWidth < 798;
</script>

<div class="indicator-metrics-container" bind:clientWidth>
  <!-- PUMA -->
  {#if $currentPUMAData}
    <div
      class="indicator-item"
      id="indicator-puma"
      aria-label={`The ${$currentStateData.name} PUMA ${
        $currentPUMAData.name
      } ${$metricToggleData.label} is ${$metricToggleData.a11yFormatFun(
        $currentPUMAData.value
      )}`}
    >
      <span class="label" aria-hidden="true">
        {isCompact ? $currentPUMAData.abbr : $currentPUMAData.name}:
      </span>
      <span
        class={$currentPUMAData ? "metric underlined" : "metric"}
        aria-hidden="true"
      >
        {$currentPUMAData.formattedValue}
      </span>
    </div>
  {/if}

  <!-- STATE -->
  {#if $currentStateData}
    <div
      class="indicator-item"
      id="indicator-state"
      aria-label={`The ${$currentStateData.name} ${
        $metricToggleData.label
      } is ${$metricToggleData.a11yFormatFun($currentStateData.value)}`}
    >
      <span class="label" aria-hidden="true">
        {isCompact ? $currentStateData.abbr : $currentStateData.name}:
      </span>
      <span
        class={$currentState && !$currentPUMA ? "metric underlined" : "metric"}
        aria-hidden="true"
      >
        {$currentStateData.formattedValue}
      </span>
    </div>
  {/if}

  <!-- NATIONAL -->
  <div
    class="indicator-item"
    id="indicator-national"
    aria-label={`The national ${
      $metricToggleData.label
    } is ${$metricToggleData.a11yFormatFun($metricToggleData.national)}`}
  >
    <span class="label" aria-hidden="true">
      {isCompact ? "USA" : "National"}:
    </span>
    <span
      class={!$currentState && !$currentPUMA ? "metric underlined" : "metric"}
      aria-hidden="true"
    >
      {$metricToggleData.formatFun($metricToggleData.national)}
    </span>
  </div>
</div>

<style>
  /* inline text */
  .indicator-metrics-container {
    font-weight: bold;
    display: flex;
    justify-content: center;
    column-gap: 2.5rem;
    padding-bottom: 1.5rem;
  }

  .indicator-item {
    display: flex;
    text-align: center;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    font-weight: 500;
    justify-self: center;
    align-self: center;
    font-size: 1.125rem;
    color: var(--color-gray-shade-darkest);
  }

  /* underlined metric */
  .metric {
    font-weight: 700;
    text-decoration: solid;
    padding-left: 0.25rem;
  }

  .underlined {
    text-decoration-line: underline;
    text-decoration-color: var(--color-wr-orange);
    text-decoration-thickness: 0.3125rem;
    text-underline-offset: 0.25rem;
  }
</style>
