import "./app.css";
import App from "./App.svelte";
import { pymChild } from "./pymDefine";
import { setDatavizTitle } from "./analytics";
setDatavizTitle("workrise-where-worker");

const app = new App({
  target: document.getElementById("app"),
});

export default app;
