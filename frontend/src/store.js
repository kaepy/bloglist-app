/**
 * @module store
 * Redux store configuration using Redux Toolkit's configureStore.
 *
 * Manages user authentication state via a single Redux slice.
 * - user: Currently authenticated user (or null)
 *
 * configureStore automatically sets up:
 * - Redux DevTools integration
 * - redux-thunk middleware (enables async action creators)
 * - Immutability and serializability checks in development mode
 */

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
