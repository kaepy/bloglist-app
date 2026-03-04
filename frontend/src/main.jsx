/**
 * @module main
 * Application entry point. Mounts the React app into the DOM.
 *
 * Provider nesting order matters:
 * - ThemeProvider + CssBaseline must be outermost (after StrictMode)
 *   so all components inherit the theme and get normalized base styles
 * - QueryClientProvider must wrap everything that fetches data
 * - UserContextProvider must wrap NotificationContextProvider because
 *   notifications can reference user state (e.g., show username on login)
 * - StrictMode is outermost so it catches issues in all providers too
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContextProvider } from "./contexts/UserContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";
import theme from "./theme";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "./App";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <NotificationContextProvider>
            <App />
          </NotificationContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
