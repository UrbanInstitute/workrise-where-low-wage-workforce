import mapboxgl from "mapbox-gl";
import { writable, get } from "svelte/store";
import { currentState, hoveredState, hoveredStateData } from "./currentState";
import { currentPUMA, hoveredPUMA, hoveredPUMAData } from "./currentPUMA";
import { metricToggle } from "./metricToggle";
import {
  CustomControl,
  getInitialCoords,
  getCurrentCoords,
} from "../lib/Map/customControl";
import { logClickToGA } from "../analytics";

export function newMapStore(el) {
  const usBounds = new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(-124.848974, 24.396308),
    new mapboxgl.LngLat(-66.885444, 49.384358)
  );

  let lastStateFeatureId;
  let lastPUMAFeatureId;
  let mapIsLoaded = false;

  let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  function showPopup() {
    // Show the popup at the coordinates with some data
    // @ts-ignore
    popup.trackPointer().addClassName("mapbox-pointer").addTo(map);
  }
  function updatePopup() {
    let stateText = `<span class="popup-name">${
      get(hoveredStateData).name
    }</span><br><span class="popup-value">${
      get(hoveredStateData).formattedValue
    }</span>`;
    let pumaText = get(hoveredPUMA)
      ? `<span class="popup-name">${
          get(hoveredPUMAData).name
        }<span><br><span class="popup-value">${
          get(hoveredPUMAData).formattedValue
        }</span>`
      : "";
    let text = pumaText ? pumaText : stateText;
    popup.setHTML(text);
  }
  function hidePopup() {
    popup.remove();
  }

  const customControl = new CustomControl({
    className: "fit-bounds-button",
    title: "Fit to continental US",
    eventHandler: () => {
      map.fitBounds(usBounds);
    },
  });

  const map = new mapboxgl.Map({
    accessToken:
      "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ",
    container: el,
    style: "mapbox://styles/urbaninstitute/cljiq0szr006t01p14b832eit", // if updated and not showing, add ?fresh=true
    center: [-95.867209, 37.940710685781056],
    zoom: 3.6047576698049464,
    minZoom: 2,
    antialias: true,
    dragPan: true,
    dragRotate: false,
    cooperativeGestures: true,
  })
    .addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right"
    )
    .addControl(customControl, "bottom-right");

  let initialCoords = getInitialCoords(map, usBounds);

  return {
    // return map object
    getMap: function () {
      return map;
    },

    resetMap: function () {
      this.flyReset();
      this.showStateLayer(get(metricToggle));
      currentPUMA.set(null);
      currentState.set(null);

      this.stateFilter("999999");
      this.PUMAFilter("999999999");
    },

    // on load functionality
    onLoad: function () {
      map.on("load", () => {
        // set cool opacity transition
        map.setPaintProperty("data1-state", "fill-opacity-transition", {
          duration: 500,
        });
        map.setPaintProperty("data1-puma", "fill-opacity-transition", {
          duration: 500,
        });
        map.setPaintProperty("data2-state", "fill-opacity-transition", {
          duration: 500,
        });
        map.setPaintProperty("data2-puma", "fill-opacity-transition", {
          duration: 500,
        });

        // set state click strokes
        map.setLayoutProperty("state-click-strokes", "visibility", "visible");
        map.setPaintProperty("state-click-strokes", "line-opacity", 1);
        this.stateFilter("999999");

        // set state hover strokes
        map.setLayoutProperty("state-hover-strokes", "visibility", "visible");
        map.setPaintProperty("state-hover-strokes", "line-opacity", [
          "case",
          ["boolean", ["feature-state", "hoverHighlight"], false],
          1,
          0,
        ]);

        // set puma click strokes
        map.setLayoutProperty("puma-click-strokes", "visibility", "none");
        map.setPaintProperty("puma-click-strokes", "line-opacity", 1);
        this.PUMAFilter("999999999");
        // set puma hover strokes
        map.setLayoutProperty("puma-hover-strokes", "visibility", "none");
        map.setLayoutProperty("puma-hover-fill", "visibility", "none");
        map.setPaintProperty("puma-hover-strokes", "line-opacity", [
          "case",
          ["boolean", ["feature-state", "hoverHighlight"], false],
          1,
          0,
        ]);

        mapIsLoaded = true;
      });

      //////* STATE *//////
      map.on("click", "state-hover-fill", (e) => {
        currentState.set(e.features[0].properties.GEOID);
        logClickToGA(
          // @ts-ignore
          e.target._container,
          `map-state-click--${e.features[0].properties.GEOID}`
        );
      });

      map.on("mousemove", "state-hover-fill", (e) => {
        let featureId = e.features[0].properties.GEOID;
        hoveredState.set(featureId);

        // if there is a last state feature and it's not the current feature,
        // set the highlight to false
        if (lastStateFeatureId && lastStateFeatureId !== featureId) {
          this.removeOutlineStateHover(lastStateFeatureId);
        }

        // set the highlight to true for the current feature
        this.outlineStateHover(get(hoveredState));

        // at the end of the logic, set the last state feature to the current feature
        lastStateFeatureId = featureId;
      });

      map.on("mouseout", "state-hover-fill", (e) => {
        hoveredState.set(null);
        this.removeOutlineStateHover(lastStateFeatureId);
      });

      //////* PUMA *//////
      map.on("mousemove", "puma-hover-fill", (e) => {
        let featureId = e.features[0].properties.GEOID10;
        hoveredPUMA.set(featureId);

        // if there is a last state feature and it's not the current feature,
        // set the highlight to false
        if (lastPUMAFeatureId && lastPUMAFeatureId !== featureId) {
          this.removeOutlinePUMAHover(lastPUMAFeatureId);
        }

        // set the highlight to true for the current feature
        this.outlinePUMAHover(get(hoveredPUMA));

        // at the end of the logic, set the last state feature to the current feature
        lastPUMAFeatureId = featureId;
      });

      map.on("mouseleave", "puma-hover-fill", () => {
        hoveredPUMA.set(null);
        this.removeOutlinePUMAHover(lastPUMAFeatureId);
      });

      // POPUP
      map.on("mouseenter", "state-hover-fill", showPopup);
      map.on("mousemove", "state-hover-fill", updatePopup);
      map.on("mouseleave", "state-hover-fill", hidePopup);

      // BUTTON
      map.on("zoom", () => {
        if (this.isMapLoaded()) {
          let currentCoords = getCurrentCoords(map);
          if (JSON.stringify(currentCoords) == JSON.stringify(initialCoords)) {
            customControl.hide();
          } else {
            customControl.show();
          }
        }
      });

      map.on("load", () => {
        if (this.isMapLoaded()) {
          let currentCoords = getCurrentCoords(map);
          if (JSON.stringify(currentCoords) == JSON.stringify(initialCoords)) {
            customControl.hide();
          } else {
            customControl.show();
          }
        }
      });
    },

    // set state filter
    stateFilter: function (stateId) {
      map.setFilter("state-click-strokes", [
        "match",
        ["get", "STATEFP"],
        stateId,
        true,
        false,
      ]);
    },

    // set puma filter
    PUMAFilter: function (pumaId) {
      map.setFilter("puma-click-strokes", [
        "match",
        ["get", "GEOID10"],
        pumaId,
        true,
        false,
      ]);
    },

    isMapLoaded: function () {
      return mapIsLoaded;
    },

    // fly to fit continental US
    flyReset: function () {
      map.fitBounds(usBounds);
    },

    flyToBounds: function (currentData) {
      // if alaska, set specific coords

      if (currentData.abbr == "AK") {
        map.flyTo({
          center: [-153.369141, 62.5],
          zoom: 3,
        });
        // otherwise, fit to bounding box
      } else {
        map.fitBounds(currentData.bbox, { padding: 35 });
      }
    },

    //////* LAYERS *//////

    switchMetric: function (metricToggle) {
      let active = metricToggle ? "data1" : "data2";
      let inactive = !metricToggle ? "data1" : "data2";

      // get current state opacity and transfer to other layer
      let newStateOpacity = map.getPaintProperty(
        `${inactive}-state`,
        "fill-opacity"
      );
      map.setPaintProperty(`${inactive}-state`, "fill-opacity", 0);
      map.setPaintProperty(`${active}-state`, "fill-opacity", newStateOpacity);

      // get current puma opacity and transfer to other layer
      let newPUMAOpacity = map.getPaintProperty(
        `${inactive}-puma`,
        "fill-opacity"
      );
      map.setPaintProperty(`${inactive}-puma`, "fill-opacity", 0);
      map.setPaintProperty(`${active}-puma`, "fill-opacity", newPUMAOpacity);
    },

    showStateLayer: function (metricToggle) {
      // turn off puma strokes
      map.setLayoutProperty("puma-hover-fill", "visibility", "none");
      map.setLayoutProperty("puma-hover-strokes", "visibility", "none");
      map.setLayoutProperty("puma-click-strokes", "visibility", "none");

      // turn off puma click
      map.off("click", "puma-hover-fill", () => {});

      // transition opacity
      let active = metricToggle ? "data1" : "data2";
      let inactive = !metricToggle ? "data1" : "data2";
      map.setPaintProperty(`${active}-state`, "fill-opacity", 0.8);
      map.setPaintProperty(`${active}-puma`, "fill-opacity", 0);

      map.setPaintProperty(`${inactive}-state`, "fill-opacity", 0);
      map.setPaintProperty(`${inactive}-puma`, "fill-opacity", 0);
    },

    showPUMALayer: function (metricToggle) {
      // turn on puma strokes
      map.setLayoutProperty("puma-hover-fill", "visibility", "visible");
      map.setLayoutProperty("puma-hover-strokes", "visibility", "visible");
      map.setLayoutProperty("puma-click-strokes", "visibility", "visible");

      // turn on puma click
      map.on("click", "puma-hover-fill", (e) => {
        let featureId = e.features[0].properties.GEOID10;
        // if the feature is the same as the currently selected puma
        if (featureId !== get(currentPUMA)) {
          currentPUMA.set(featureId);
          logClickToGA(
            // @ts-ignore
            e.target._container,
            `map-puma-click--${e.features[0].properties.NAME10}`
          );
        }
      });

      // transition opacity
      let active = metricToggle ? "data1" : "data2";
      let inactive = !metricToggle ? "data1" : "data2";
      map.setPaintProperty(`${active}-state`, "fill-opacity", 0);
      map.setPaintProperty(`${active}-puma`, "fill-opacity", 0.8);
      map.setPaintProperty(`${inactive}-state`, "fill-opacity", 0);
      map.setPaintProperty(`${inactive}-puma`, "fill-opacity", 0);
    },

    //////* STATE *//////

    // set outline state
    outlineStateHover: (stateId) => {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "state",
          id: stateId,
        },
        { hoverHighlight: true }
      );
    },

    // remove outline state
    removeOutlineStateHover: (stateId) => {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "state",
          id: stateId,
        },
        { hoverHighlight: false }
      );
    },

    //////* PUMA *//////

    // set outline puma
    outlinePUMAHover: (pumaId) => {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "puma",
          id: pumaId,
        },
        { hoverHighlight: true }
      );
    },

    // remove outline puma
    removeOutlinePUMAHover: (pumaId) => {
      map.setFeatureState(
        {
          source: "composite",
          sourceLayer: "puma",
          id: pumaId,
        },
        { hoverHighlight: false }
      );
    },
  };
}

export const mapStore = writable(null);
