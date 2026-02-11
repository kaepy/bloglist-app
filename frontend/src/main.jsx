/**
 * @module main
 * Application entry point. Mounts the React app into the DOM.
 *
 * Wraps the app in:
 * - React.StrictMode: Enables additional development warnings and double-renders
 * - Provider: Makes the Redux store available to all components via useSelector/useDispatch
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
