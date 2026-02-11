/**
 * @file userReducer.test.js
 * Unit tests for the user Redux slice and async thunks.
 *
 * Tests cover:
 * - Reducer: initial state, setUser action, clearing user
 * - initializeUser thunk: loading from storage, handling empty storage
 * - loginUser thunk: successful login (service + storage + dispatch),
 *   and error propagation on failed login
 * - logoutUser thunk: clearing state, removing from storage, notification
 *
 * Both the storage and login services are fully mocked.
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import storage from "../services/storage";
import loginService from "../services/login";
import userReducer, {
  initializeUser,
  loginUser,
  logoutUser,
} from "./userReducer";

vi.mock("../services/storage");
vi.mock("../services/login");

describe("USER REDUCER", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return the initial state when called with undefined state", () => {
    const newState = userReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(newState).toBe(null);
  });

  test("should handle setUser action", () => {
    const user = { username: "testuser", name: "Test User", token: "abc123" };
    const newState = userReducer(null, {
      type: "user/setUser",
      payload: user,
    });
    expect(newState).toEqual(user);
  });

  test("should handle setUser with null to clear user", () => {
    const existingUser = { username: "testuser", name: "Test User" };
    const newState = userReducer(existingUser, {
      type: "user/setUser",
      payload: null,
    });
    expect(newState).toBe(null);
  });

  describe("ASYNC THUNKS", () => {
    test("initializeUser dispatches setUser when user found in storage", () => {
      const user = { username: "testuser", name: "Test User", token: "abc123" };
      storage.loadUser.mockReturnValue(user);

      const dispatch = vi.fn();
      initializeUser()(dispatch);

      expect(storage.loadUser).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: "user/setUser",
        payload: user,
      });
    });

    test("initializeUser does not dispatch when no user in storage", () => {
      storage.loadUser.mockReturnValue(null);

      const dispatch = vi.fn();
      initializeUser()(dispatch);

      expect(storage.loadUser).toHaveBeenCalledTimes(1);
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("loginUser calls login service, saves user, and dispatches setUser and notification", async () => {
      const credentials = { username: "testuser", password: "secret" };
      const user = { username: "testuser", name: "Test User", token: "abc123" };
      loginService.login.mockResolvedValue(user);

      const dispatch = vi.fn();
      await loginUser(credentials)(dispatch);

      expect(loginService.login).toHaveBeenCalledWith(credentials);
      expect(storage.saveUser).toHaveBeenCalledWith(user);
      expect(dispatch).toHaveBeenCalledWith({
        type: "user/setUser",
        payload: user,
      });
      // showNotification thunk also dispatched
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });

    test("loginUser throws when login service fails", async () => {
      const credentials = { username: "testuser", password: "wrong" };
      loginService.login.mockRejectedValue(new Error("invalid credentials"));

      const dispatch = vi.fn();

      await expect(loginUser(credentials)(dispatch)).rejects.toThrow(
        "invalid credentials",
      );
      expect(storage.saveUser).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("logoutUser dispatches setUser(null), removes storage, and dispatches notification", () => {
      const user = { username: "testuser", name: "Test User" };
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({ user }));

      logoutUser()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: "user/setUser",
        payload: null,
      });
      expect(storage.removeUser).toHaveBeenCalledTimes(1);
      // showNotification thunk also dispatched
      expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
