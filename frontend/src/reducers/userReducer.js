/**
 * @module reducers/userReducer
 * Redux Toolkit slice for managing the authenticated user state.
 *
 * State shape: null | { username: string, name: string, token: string }
 *
 * Provides three thunks:
 * - initializeUser: Restores session from localStorage on app load
 * - loginUser: Authenticates via API, persists to storage, updates store
 * - logoutUser: Clears storage and store, shows farewell notification
 *
 * REFACTORING NOTES:
 * - loginUser doesn't catch errors — the caller (App.jsx) handles them.
 *   This is a valid pattern but should be documented so future devs
 *   don't accidentally add error handling in both places.
 * - logoutUser uses getState() to access the user's name for the
 *   notification. This works but couples the thunk to the store shape.
 *   An alternative is to pass the user name as a parameter.
 */

import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import storage from "../services/storage";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    /** Set or clear the current user (null = logged out) */
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

/** Thunk: Restore the user session from localStorage on app startup */
export const initializeUser = () => {
  return (dispatch) => {
    const user = storage.loadUser();
    if (user) {
      dispatch(setUser(user));
    }
  };
};

/** Thunk: Log in a user via the API, persist the token, and update the store */
export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    storage.saveUser(user);
    dispatch(setUser(user));
    return user; // Return user so caller can show notification via context
  };
};

/**
 * Thunk: Log out the current user.
 * Reads the user's name from the store (via getState) for the farewell
 * notification, then clears the user from both the store and localStorage.
 */
export const logoutUser = () => {
  return (dispatch, getState) => {
    const user = getState().user;
    dispatch(setUser(null));
    storage.removeUser();
    return user; // Return user so caller can show notification via context
  };
};

export default userSlice.reducer;
