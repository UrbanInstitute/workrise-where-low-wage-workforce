import { writable, derived } from "svelte/store";
import { metricToggleData } from "./metricToggle";
import pumaData from "../data/puma-data.json";

export const currentPUMA = writable(null);
export const hoveredPUMA = writable(null);

const getPumaData = ($store, $metricToggleData) => {
  let output;
  // get current puma
  pumaData.map((d) => {
    if (d.state_puma === $store) {
      output = d;
    }
  });

  // add formatted value to output
  if (output) {
    output.abbr = "PUMA";
    output.value = output[$metricToggleData.metric];
    output.formattedValue = $metricToggleData.formatFun(
      output[$metricToggleData.metric]
    );
  }
  return output;
};

export const currentPUMAData = derived(
  [currentPUMA, metricToggleData],
  ([$currentPUMA, $metricToggleData]) => {
    /** @type{object}
     * @property {string} state_puma - PUMA ID
     * @property {number} medianwage - value of median wage
     * @property {number} percentlowwage - value of percent low wage
     * @property {string} statefip - 2 digit state fip ID
     * @property {number} ind1 - ID of industry 1
     * @property {number} ind2 - ID of industry 2
     * @property {number} ind3 - ID of industry 3
     * @property {number} concentration1 - value of industry 1 concentration
     * @property {number} concentration2 - value of industry 2 concentration
     * @property {number} concentration3 - value of industry 3 concentration
     * @property {string} name - name of PUMA
     * @property {array} bbox - bounding box of PUMA
     */

    return getPumaData($currentPUMA, $metricToggleData);
  }
);

export const hoveredPUMAData = derived(
  [hoveredPUMA, metricToggleData],
  ([$hoveredPUMA, $metricToggleData]) => {
    /** @type{object}
     * @property {string} state_puma - PUMA ID
     * @property {number} medianwage - value of median wage
     * @property {number} percentlowwage - value of percent low wage
     * @property {string} statefip - 2 digit state fip ID
     * @property {number} ind1 - ID of industry 1
     * @property {number} ind2 - ID of industry 2
     * @property {number} ind3 - ID of industry 3
     * @property {number} concentration1 - value of industry 1 concentration
     * @property {number} concentration2 - value of industry 2 concentration
     * @property {number} concentration3 - value of industry 3 concentration
     * @property {string} name - name of PUMA
     * @property {array} bbox - bounding box of PUMA
     */

    return getPumaData($hoveredPUMA, $metricToggleData);
  }
);
