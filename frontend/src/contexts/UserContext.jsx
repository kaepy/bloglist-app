/**
 * @context UserContext
 * Provides user authentication state and actions to the entire app.
 *
 * What it provides:
 * - user: the current user object ({ username, name, token }) or null
 * - loginMutation: React Query mutation for the async login API call
 * - logout: function to clear the session (returns the user for notifications)
 *
 * Session initialization:
 *   On mount, the provider reads localStorage and restores any saved session
 *   automatically. Components don't need to trigger this — it's self-contained.
 */

import { createContext, useReducer, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import loginService from "../services/login";
import storage from "../services/storage";

// Reducer: handles two actions — set the user or clear it
const UserReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(UserReducer, null);

  // --- Session initialization (on mount — restore saved session from localStorage) ---
  // Runs once when the provider mounts. No component needs to trigger this.
  useEffect(() => {
    const savedUser = storage.loadUser();
    if (savedUser) {
      userDispatch({ type: "SET_USER", payload: savedUser });
    }
  }, []);

  // --- Login (async — uses React Query mutation) ---
  // mutationFn: the function that makes the API call
  // onSuccess: runs after the API call succeeds — saves to localStorage and updates React state
  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (user) => {
      storage.saveUser(user);
      userDispatch({ type: "SET_USER", payload: user });
    },
  });

  // --- Logout (sync — clear state and localStorage) ---
  // Returns the user object so the caller can show a "goodbye" notification
  const logout = useCallback(() => {
    const loggedOutUser = user;
    userDispatch({ type: "CLEAR_USER" });
    storage.removeUser();
    return loggedOutUser;
  }, [user]);

  return <UserContext.Provider value={{ user, loginMutation, logout }}>{children}</UserContext.Provider>;
};

export default UserContext;
