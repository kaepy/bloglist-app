/**
 * @module store
 * Redux store configuration using Redux Toolkit's configureStore.
 *
 * Combines three slices of state:
 * - notification: UI notification messages (auto-dismissing)
 * - blogs: Array of blog objects fetched from the API
 * - user: Currently authenticated user (or null)
 *
 * configureStore automatically sets up:
 * - Redux DevTools integration
 * - redux-thunk middleware (enables async action creators)
 * - Immutability and serializability checks in development mode
 */

import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
  },
});

export default store;
