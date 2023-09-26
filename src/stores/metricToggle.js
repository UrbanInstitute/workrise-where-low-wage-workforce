import { writable, derived } from "svelte/store";
import { scaleThreshold } from "d3-scale";
import nationalData from "../data/national-data.json";

export const metricToggle = writable(true);

export const metricToggleData = derived(metricToggle, ($metricToggle) => {
  /** @type{object}
   * @property {string} metric - value of metric
   * @property {string} label - label of metric
   * @property {array} domain - domain
   * @property {array} ticks - ticks
   * @property {number} national - national metric value
   * @property {array} colorDomain - numeric domain of metric
   * @property {array} colorRange - color range of metric
   * @property {function} scaleFun - d3 scale function (scaleLinear)
   * @property {function} formatFun - formatted function
   * @property {function} tickFormatFun - tick formatted function
   * @property {function} a11yFormatFun - accessibly formatted function
   */
  let val = $metricToggle
    ? {
        metric: "medianwage",
        label: "Median Wage of Workers",
        domain: [10, 45],
        ticks: [10, 15, 20, 25, 30, 35, 40, 45],
        expandedDomain: [10, 70],
        expandedTicks: [10, 20, 30, 40, 50, 60, 70],
        national: nationalData.medianwage,
        legendDomain: [15, 18, 21, 24, 27, 30],
        colorDomain: [18, 21, 24, 27, 30],
        colorRange: [
          "#b6c3d1",
          "#899eb4",
          "#5b7997",
          "#2e537a",
          "#002e5d",
          "#000f1f",
        ],
        scaleFun(d) {
          // @ts-ignore
          return scaleThreshold()
            .domain(this.colorDomain)
            .range(this.colorRange)(d);
        },
        formatFun: (d) => {
          return `$${d.toFixed(2)}/hr`;
        },
        legendFormatFun: (d) => {
          return `$${d.toFixed(0)}/hr`;
        },
        tickFormatFun: (d) => {
          return `$${Math.round(d)}`;
        },
        a11yFormatFun: (d) => {
          return `$${d.toFixed(2)} per hour`;
        },
      }
    : {
        metric: "percentlowwage",
        label: "Share of Low Wage Workers",
        domain: [0.1, 0.5],
        ticks: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5],
        expandedDomain: [0.1, 0.65],
        expandedTicks: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
        national: nationalData.percentlowwage,
        colorDomain: [0.244, 0.288, 0.332, 0.376, 0.42],
        legendDomain: [0.2, 0.244, 0.288, 0.332, 0.376, 0.42],
        colorRange: [
          "#abe6dc",
          "#73d5c4",
          "#3bc4ad",
          "#2a8c7b",
          "#19544a",
          "#081c19",
        ],
        scaleFun(d) {
          // @ts-ignore
          return scaleThreshold()
            .domain(this.colorDomain)
            .range(this.colorRange)(d);
        },
        formatFun: (d) => {
          return `${(d * 100).toFixed(1)}%`;
        },
        legendFormatFun: (d) => {
          return `${(d * 100).toFixed(1)}%`;
        },
        tickFormatFun: (d) => {
          return `${(d * 100).toFixed(0)}%`;
        },
        a11yFormatFun: (d) => {
          return `${(d * 100).toFixed(1)}%`;
        },
      };
  return val;
});
