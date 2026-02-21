/**
 * @module main
 * Application entry point. Mounts the React app into the DOM.
 *
 * Provider nesting order matters:
 * - QueryClientProvider must wrap everything that fetches data
 * - UserContextProvider must wrap NotificationContextProvider because
 *   notifications can reference user state (e.g., show username on login)
 * - StrictMode is outermost so it catches issues in all providers too
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContextProvider } from "./contexts/UserContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";

import App from "./App";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
