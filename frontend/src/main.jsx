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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import store from "./store";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
