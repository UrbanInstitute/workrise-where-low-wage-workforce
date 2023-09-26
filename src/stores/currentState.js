import { writable, derived } from "svelte/store";
import pumaData from "../data/puma-data.json";
import { metricToggleData } from "./metricToggle";
import stateData from "../data/state-data.json";
import { extent } from "d3";

export const currentState = writable(null);
export const hoveredState = writable(null);

const getStateData = ($store, $metricToggleData) => {
  let output;
  // get current state
  stateData.map((d) => {
    if (d.statefip === $store) {
      output = d;
    }
  });

  // add formatted value to output
  if (output) {
    output.value = output[$metricToggleData.metric];
    output.formattedValue = $metricToggleData.formatFun(
      output[$metricToggleData.metric]
    );
  }
  return output;
};

export const currentStateData = derived(
  [currentState, metricToggleData],
  ([$currentState, $metricToggleData]) => {
    /** @type{object}
     * @property {string} statefip - state ID
     * @property {number} medianwage - value of median wage
     * @property {number} percentlowwage - value of percent low wage
     * @property {string} abbr - 2 character state abbreviation
     * @property {number} ind1 - ID of industry 1
     * @property {number} ind2 - ID of industry 2
     * @property {number} ind3 - ID of industry 3
     * @property {number} concentration1 - value of industry 1 concentration
     * @property {number} concentration2 - value of industry 2 concentration
     * @property {number} concentration3 - value of industry 3 concentration
     * @property {string} name - name of state
     * @property {array} bbox - bounding box of state
     * @property {number} value - currently selected metric's value
     * @property {string} formattedValue - currently selected metric's value (formatted)
     */

    return getStateData($currentState, $metricToggleData);
  }
);

export const hoveredStateData = derived(
  [hoveredState, metricToggleData],
  ([$hoveredState, $metricToggleData]) => {
    /** @type{object}
     * @property {string} statefip - state ID
     * @property {number} medianwage - value of median wage
     * @property {number} percentlowwage - value of percent low wage
     * @property {string} abbr - 2 character state abbreviation
     * @property {number} ind1 - ID of industry 1
     * @property {number} ind2 - ID of industry 2
     * @property {number} ind3 - ID of industry 3
     * @property {number} concentration1 - value of industry 1 concentration
     * @property {number} concentration2 - value of industry 2 concentration
     * @property {number} concentration3 - value of industry 3 concentration
     * @property {string} name - name of state
     * @property {array} bbox - bounding box of state
     * @property {number} value - currently selected metric's value
     * @property {string} formattedValue - currently selected metric's value (formatted)
     */

    return getStateData($hoveredState, $metricToggleData);
  }
);

export const currentStatePUMAList = derived(currentState, ($currentState) => {
  let val = [];
  pumaData.map((d) => {
    if (d.statefip === $currentState) {
      val = [...val, d];
    }
  });
  return val;
});

export const currentStateRange = derived(
  [currentStatePUMAList, metricToggleData],
  ([$currentStatePUMAList, $metricToggleData]) => {
    let val = $currentStatePUMAList.map((d) => {
      return d[$metricToggleData.metric];
    });
    let output =
      extent(val)[0] == undefined ? $metricToggleData.domain : extent(val);
    return output;
  }
);
