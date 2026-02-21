/**
 * @file UserContext.test.jsx
 * Tests for the UserContext provider and its exposed API.
 *
 * Tests cover:
 * - Initial state: user is null before any action
 * - Session initialization: user is automatically restored from localStorage on mount
 * - loginMutation: calls login service, saves to storage, updates user state
 * - loginMutation error: does not update state or storage on failure
 * - logout: clears user state, removes from storage, returns the logged-out user
 *
 * Test approach:
 *   We use @testing-library/react's renderHook to render the useUser hook
 *   inside a wrapper that provides both QueryClientProvider (needed by
 *   useMutation inside UserContext) and UserContextProvider. This lets us
 *   call login/logout directly and assert on the resulting user state —
 *   no actual components needed.
 *
 * Why renderHook instead of rendering a component?
 *   We're testing the context logic (state transitions, service calls),
 *   not UI rendering. renderHook gives us direct access to the hook's
 *   return values without writing throwaway test components.
 *
 * Mocking:
 *   storage and loginService are vi.mock'd so no real localStorage or
 *   HTTP calls happen. We control what they return and verify they're
 *   called with the right arguments.
 *
 * Note on storage.loadUser in every test:
 *   UserContextProvider's useEffect runs on every mount and calls
 *   storage.loadUser(). Each test must mock its return value explicitly
 *   to control whether a session is restored.
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserContextProvider } from "./UserContext";
import { useUser } from "../hooks/useUser";
import storage from "../services/storage";
import loginService from "../services/login";

vi.mock("../services/storage");
vi.mock("../services/login");

/**
 * Each test gets a fresh QueryClient so mutation state doesn't leak between tests.
 *
 * The nesting mirrors main.jsx:
 *   QueryClientProvider → UserContextProvider → (hook under test)
 *
 * Why QueryClientProvider is needed:
 *   UserContextProvider calls useMutation internally, which requires
 *   a QueryClient to exist above it in the component tree.
 */
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        // Disable retries in tests so failed mutations fail immediately
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>{children}</UserContextProvider>
    </QueryClientProvider>
  );
};

describe("USER CONTEXT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("initial user state is null", () => {
    storage.loadUser.mockReturnValue(null); // no saved session

    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toBe(null);
  });

  describe("SESSION INITIALIZATION", () => {
    test("restores user from localStorage automatically on mount", () => {
      const savedUser = { username: "testuser", name: "Test User", token: "abc123" };
      storage.loadUser.mockReturnValue(savedUser);

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      // No manual call needed — the provider's useEffect runs automatically on mount
      expect(storage.loadUser).toHaveBeenCalledTimes(1);
      expect(result.current.user).toEqual(savedUser);
    });

    test("keeps user as null when no saved session exists", () => {
      storage.loadUser.mockReturnValue(null);

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      expect(storage.loadUser).toHaveBeenCalledTimes(1);
      expect(result.current.user).toBe(null);
    });
  });

  describe("LOGIN MUTATION", () => {
    test("successful login saves user to storage and updates state", async () => {
      const credentials = { username: "testuser", password: "secret" };
      const user = { username: "testuser", name: "Test User", token: "abc123" };
      storage.loadUser.mockReturnValue(null);
      loginService.login.mockResolvedValue(user);

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      // mutateAsync returns a promise — we await it inside act()
      // because it triggers both an async operation AND state updates
      await act(async () => {
        const returnedUser = await result.current.loginMutation.mutateAsync(credentials);
        expect(returnedUser).toEqual(user);
      });

      // React Query passes extra context as a 2nd arg to mutationFn, so we
      // check only the first argument (the credentials we passed in)
      expect(loginService.login).toHaveBeenCalledWith(credentials, expect.anything());
      expect(storage.saveUser).toHaveBeenCalledWith(user);
      expect(result.current.user).toEqual(user);
    });

    test("failed login does not update state or save to storage", async () => {
      const credentials = { username: "testuser", password: "wrong" };
      storage.loadUser.mockReturnValue(null);
      loginService.login.mockRejectedValue(new Error("invalid credentials"));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      // We expect mutateAsync to throw, so we catch the error
      await act(async () => {
        await expect(result.current.loginMutation.mutateAsync(credentials)).rejects.toThrow("invalid credentials");
      });

      expect(storage.saveUser).not.toHaveBeenCalled();
      expect(result.current.user).toBe(null);
    });
  });

  describe("LOGOUT", () => {
    test("clears user state, removes from storage, and returns the logged-out user", () => {
      // Mock storage to return a user on mount — the provider restores it automatically
      const user = { username: "testuser", name: "Test User", token: "abc123" };
      storage.loadUser.mockReturnValue(user);

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      // User should already be set (restored on mount by the provider's useEffect)
      expect(result.current.user).toEqual(user);

      let loggedOutUser;
      act(() => {
        loggedOutUser = result.current.logout();
      });

      // Returns the user that was logged out (so the caller can show a notification)
      expect(loggedOutUser).toEqual(user);
      expect(result.current.user).toBe(null);
      expect(storage.removeUser).toHaveBeenCalledTimes(1);
    });
  });
});
