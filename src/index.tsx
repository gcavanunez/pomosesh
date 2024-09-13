// /* @refresh reload */
// import { render } from 'solid-js/web';

import "./index.css";
// import App from './App';

// render(() => <App />, document.getElementById('root') as HTMLElement);
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import Index from "./routes/index";
import Experiment from "./routes/experiment";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

// const routes = [
//   {
//     path: "/",
//     component: lazy(() => import("./routes/index.js")),
//   },
// ];

render(
  () => (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/experiment" component={Experiment} />
    </Router>
  ),
  wrapper,
);
