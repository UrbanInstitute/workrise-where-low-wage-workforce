<script>
  import { metricToggle, metricToggleData } from "../stores/metricToggle";
  import { mapStore } from "../stores/map";

  import { logClickToGA } from "../analytics";

  // update metric toggle when clicked
  let toggle = (el) => {
    if (!el.target.classList.contains("active")) {
      metricToggle.update((value) => !value);
      $mapStore.switchMetric($metricToggle);

      logClickToGA(
        el.currentTarget,
        `metric-toggle--${$metricToggleData.metric}`
      );
    }
  };
</script>

<div id="toggle-container">
  <!-- Median Wage of Workers -->
  <div
    class="toggle-option"
    class:active={$metricToggle}
    on:click={toggle}
    on:keypress={toggle}
    role="button"
    tabindex="0"
    aria-label="Median Wage of Workers"
  >
    Median Wage of Workers
  </div>

  <!-- Share of Low-Wage Workers -->
  <div
    class="toggle-option"
    class:active={!$metricToggle}
    on:click={toggle}
    on:keypress={toggle}
    role="button"
    tabindex="0"
    aria-label="Share of Low-Wage Workers"
  >
    Share of Low-Wage Workers
  </div>
</div>

<style>
  #toggle-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }

  .toggle-option {
    font-size: 1.25rem;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    width: 20rem;
    line-height: 1.25rem;

    color: var(--color-gray-shade-darker);
    border: 3px solid var(--color-gray-shade-dark);
    cursor: pointer;

    padding: 1rem;

    display: table-cell;
    vertical-align: middle;
  }

  .active:first-child {
    color: var(--color-white);
    background: var(--color-wr-dark-blue);
    border: 3px solid var(--color-wr-dark-blue);
    cursor: default;
  }

  .active:nth-child(2) {
    color: var(--color-black);
    background: var(--color-wr-green);
    border: 3px solid var(--color-wr-green);
    cursor: default;
  }
</style>
