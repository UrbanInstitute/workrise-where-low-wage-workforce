# Where is the Low Wage Worker?

## Project details

This repo powers the WorkRise data tool “Where is the Low Wage Worker?”. The application focuses on two metrics, median wage and share of low wage workers by state and PUMA. The mapbox map allows users to explore, and the industry sidebar shows low wage worker share.

- Data Visualization and Development: Ben Kates
- Designer: Christina Baird
- Writer: Wes Jenkins
- Research team: Joe Peck, Kate Bahn, Bill Congdon

### Hosting Location

https://www.workrisenetwork.org/working-knowledge/where-low-wage-workforce

## Data

The main data source is ingested in to the `/R/workrise-where-worker.qmd` script. The data is then transformed and saved to `/src/data` as `national-data.json`, `state-data.json` and `puma-data.json` as well as `industry-lookup.json`.

### Mapbox Data `.mbtiles`

The R script `/R/workrise-where-worker.qmd` also creates `.mbtiles` files from the `mapboxapi` R package, which exposes a `tippecanoe` wrapper for "all in one" development. The `tigris` package is used to download PUMA shapes and merge with the data from the Excel file. The `.mbtiles` files are then uploaded to Mapbox manually in the `workrise-where-worker` style.

## Svelte stores (`src/stores/`)

In this app, there are two metrics to visualize: median wage of workers and share of low wage workers. This toggle is managed by a Svelte store (`stores/metricToggle.js`). The store is then used throughout the application to reactively determine which metric to display.

`currentState` is a writable store and `currentStateData` and `hoveredStateData` are derived stores that contain complete info for that state.

`currentPUMA` is a writable store and `currentPUMAData` and `hoveredPUMAData` are derived stores that contain complete info for that PUMA.

## Mapbox

`src/stores/map.js` is a writable store that contains the Mapbox map object. This store is used to control the map's state and is used to add/remove/change opacity of layers. The last line of the file creates a new store. A future enhancement could remove the UI update functionality embedded within the object to separate the contexts more.

This setup was inspired by finite state machines, [this talk](https://youtube.com/watch?v=UAtaoVMFt7Y&feature=share) is a great resource by the creator of a state management library, [xstate](https://github.com/statelyai/xstate) which has [`xstate/svelte`](https://github.com/statelyai/xstate/tree/main/packages/xstate-svelte).

### Layers

The following are the layers in the `workrise-where-worker` style, in order of rendering:

- `state-click-strokes`: stroke layer for state click interaction
- `state-hover-strokes`: stroke layer for state hover interaction
- `puma-click-strokes`: stroke layer for PUMA click interaction
- `puma-hover-strokes`: stroke layer for PUMA hover interaction
- `state-hover-fill`: fill layer for state hover interaction (always set to opacity 0)
- `puma-hover-fill`: fill layer for PUMA hover interaction (always set to opacity 0)
- `data1-state`: fill layer for state median wage (opacity 0.8 by default)
- `data1-puma`: fill layer for PUMA median wage (opacity 0 by default)
- `data2-state`: fill layer for state low wage worker share (opacity 0 by default)
- `data2-puma`: fill layer for PUMA low wage worker share (opacity 0 by default)

The `*-click-strokes` layers use the following command to set the stroke visibility based on the associated fips code. This insures there is exclusivity in the click stroke visibility and we don't have to worry about removing the stroke from the previous click.

```js
map.setFilter("state-click-strokes", [
  "match",
  ["get", "STATEFP"],
  stateId,
  true,
  false,
]);
```

The `*-hover-strokes` layers use the following commands to set the stroke visibility based on the associated fips code. This method is very quick based on the mouse's hover location (unlike the filter method above).

```js
map.setPaintProperty("state-hover-strokes", "line-opacity", [
  "case",
  ["boolean", ["feature-state", "hoverHighlight"], false],
  1,
  0,
]);
```

Then, the `outlineStateHover()` function is called when needed:

```js
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
```

#### Layer transitions

The `fill-opacity-transition` is set on load to achieve a fade transition effect when changing layers.

```js
map.setPaintProperty("data1-state", "fill-opacity-transition", {
  duration: 500,
});
```

### Custom "fit map to lower 48 states" button

In `src/lib/Map/customControl.js` we define a custom button that fits the map to the lower 48 states. This is used in the `src/lib/Map/Map.svelte` component.

This file also exports functions to get initial camera coordinates of the map when showing all lower 48 states as well as the current camera coordinates. This is used in determining when to show the button.

## Svelte Components

### Animation

It's worth noting the animations used throughout the application. `animate:flip`, `in:fade`, `out:fade`, and `in:fly` are all native functions from the Svelte `animate` and `transition` directives. For `animate:flip`, we've used a single value array in an `{#each}` block to meet that requirement.

The `svelte/motion` directive calls the `tweened` function for customized animation. `animate:flip` leaves the object being animated to control its own transitions. With `tweened`, we can control the specific properties of the svg object being animated.

### `/IndicatorChart/Chart.svelte`

The components in the `/IndicatorChart` directory make up the children of the `Chart.svelte` component. It's worth noting the expanded domain methodology here: if a PUMA in a state contains a value that is beyond the initial domain of the chart, the chart will reactively expand when the user activates that state. An animation indicates this change to the user.

Additionally, Svelte context is used to pass constants like the margin and SVG height to children without prop drilling.

### `DropdownSection.svelte`

This component uses the `svelte-select` package and is highly configurable. The CSS variables the package exposes are used to style the dropdown to meet design requirements.

### `IndustrySidebar.svelte`

In order to separate the industry values from the "top 3" integers, we've created two columns and a bind to the value to determine div height. This ensures that the integer's div height matches the corresponding value's.

## Other Notes

The HTML viewport is modified in `index.html` to prevent zooming on mobile devices:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1"
/>
```

## Developing

The site is built using Svelte. See `src/` directory for project files.

To install dependencies:

```bash
npm i
```

To run the development server

```bash
npm run dev
```