<script>
  import {
    currentState,
    currentStateData,
    currentStatePUMAList,
  } from "../stores/currentState";
  import { currentPUMA } from "../stores/currentPUMA";
  import Select from "svelte-select";
  import { mapStore } from "../stores/map";

  import { logClickToGA } from "../analytics";

  // json data
  import stateDataForDropdown from "../data/state-data.json";

  // create state dropdown data
  let stateDropdownData = stateDataForDropdown.map((d) => {
    return {
      value: d.statefip,
      label: d.name,
    };
  });

  // create individual object for svelte-select component
  let stateObject = {};
  $: stateObject = stateDropdownData.find((d) => d.value === $currentState);

  // create puma dropdown data
  let pumaDropdownData = [];
  $: pumaDropdownData = $currentStatePUMAList.map((d) => {
    return {
      value: d.state_puma,
      label: d.name,
    };
  });

  // create individual object for svelte-select component
  let pumaObject = {};
  $: pumaObject = pumaDropdownData.find((d) => d.value === $currentPUMA);

  // define chevron path
  const chevronPath =
    "M15.1313 0.666626C15.5179 0.666626 15.7794 0.846014 15.9272 1.20479C16.0749 1.56356 15.9954 1.85507 15.7111 2.09052L8.65117 9.12027C8.45791 9.26602 8.2419 9.33329 8.00316 9.33329C7.76442 9.33329 7.57115 9.26602 7.42335 9.12027L0.283802 2.09052C-0.000415318 1.85507 -0.0686276 1.55235 0.0677969 1.20479C0.21559 0.846014 0.477071 0.666626 0.863607 0.666626H15.1313Z";
</script>

<div id="dropdowns-container">
  <!-- state -->
  <div class="select-dropdown">
    <Select
      id="stateDropdown"
      items={stateDropdownData}
      placeholder={"Select a state"}
      showChevron={true}
      bind:justValue={$currentState}
      value={stateObject}
      clearable={true}
      on:select={(e) => {
        logClickToGA(e.detail.target, `state-dropdown--${$currentState}`);
      }}
      on:clear={(e) => {
        $mapStore.resetMap();
        logClickToGA(e.detail.target, `state-dropdown--clear`);
      }}
    >
      <!-- chevron, note: importing the SVG as a component per the docs resulted in an error -->
      <div slot="chevron-icon">
        <svg
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ><path d={chevronPath} fill="var(--color-wr-orange)" /></svg
        >
      </div>
    </Select>
  </div>
  <!-- puma -->
  {#if $currentState}
    <div class="select-dropdown">
      <Select
        id="pumaDropdown"
        items={pumaDropdownData}
        placeholder={$currentState ? "Select a PUMA" : ""}
        showChevron={true}
        disabled={$currentState ? false : true}
        bind:justValue={$currentPUMA}
        value={pumaObject}
        clearable={true}
        on:select={(e) => {
          logClickToGA(e.detail.target, `puma-dropdown--${$currentPUMA}`);
        }}
        on:clear={(e) => {
          // clear puma outline, set puma to null, and fly to state
          $mapStore.PUMAFilter("999999");
          currentPUMA.set(null);
          $mapStore.flyToBounds($currentStateData);
          logClickToGA(e.detail.target, `puma-dropdown--clear`);
        }}
      >
        <!-- chevron, note: importing the SVG as a component per the docs resulted in an error -->
        <div slot="chevron-icon">
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><path d={chevronPath} fill="var(--color-wr-orange)" /></svg
          >
        </div>
      </Select>
    </div>
  {/if}
</div>

<style>
  /* container */
  #dropdowns-container {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem 0;
  }

  /* dropdown (see svelte-select docs for CSS vars)*/
  /* https://github.com/rob-balfre/svelte-select/blob/master/docs/theming_variables.md */
  .select-dropdown {
    cursor: pointer !important;

    /* overall */
    --width: 16.25rem;
    --max-width: 16.25rem;
    --height: 2.625rem;
    --max-height: 2.625rem;
    --margin: 0;
    --padding: 0 0 0 var(--spacing-3);
    --selected-item-padding: 0 0.25rem;
    --value-container-padding: 0;
    --placeholder-color: var(--color-gray-shade-darker);

    /* font */
    --font-size: 1rem !important;
    --font-family: var(--font-family-sans) !important;

    /* border */
    --border: 1px solid var(--color-gray-shade-medium);
    --border-radius: 0;
    --border-radius-focused: 2px;
    --border-focused: 1px solid #99c8ff;

    /* list */
    --list-border-radius: 0;
    --item-first-border-radius: 0;
    --input-padding: 0;
    --internal-padding: 0;
    --item-padding: 0 var(--spacing-2) 0 var(--spacing-2);

    /* items */
    --item-color: var(--color-gray-shade-darker);
    --item-is-active-bg: var(--color-wr-dark-blue);
    --item-hover-bg: var(--color-wr-blue);
    --selected-item-color: var(--color-gray-shade-darker);

    /* chevron */
    --chevron-color: var(--color-wr-dark-blue);
    --chevron-icon-colour: var(--color-wr-dark-blue);
    --icons-color: var(--color-wr-dark-blue);
  }

  /* cursor for input */
  :global(.select-dropdown input) {
    cursor: pointer !important;
  }

  /* SCROLLBAR: NONE */

  /* Hide scrollbar for Chrome, Safari and Opera */
  /* :global(.select-dropdown .svelte-select-list::-webkit-scrollbar) {
    display: none;
  } */

  /* Hide scrollbar for IE, Edge and Firefox */
  /* :global(.select-dropdown .svelte-select-list::-webkit-scrollbar) {
    -ms-overflow-style: none;
    scrollbar-width: none;
  } */

  /* SCROLLBAR: CUSTOM */

  :global(.select-dropdown .svelte-select-list::-webkit-scrollbar) {
    display: block;
    width: 0.625rem;
  }

  :global(.select-dropdown .svelte-select-list::-webkit-scrollbar-button) {
    display: none;
  }

  :global(.select-dropdown .svelte-select-list::-webkit-scrollbar-track) {
    background-color: var(--color-gray-shade-lightest);
  }

  :global(.select-dropdown .svelte-select-list::-webkit-scrollbar-track-piece) {
    background-color: var(--color-gray-shade-lightest);
  }

  :global(.select-dropdown .svelte-select-list::-webkit-scrollbar-thumb) {
    background: var(--color-wr-orange);
    border: 1px solid var(--color-wr-orange);
  }

  :global(.select-dropdown .selected-item) {
    font-size: 1rem !important;
  }

  :global(.select-dropdown .svelte-select-list) {
    font-size: 1rem !important;
  }
</style>
