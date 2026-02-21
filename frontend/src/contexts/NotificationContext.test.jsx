/**
 * @file NotificationContext.test.jsx
 * Tests for the NotificationContext provider and its exposed API.
 *
 * Tests cover:
 * - Initial state: notification is an empty string
 * - showNotification: sets the notification with message and type
 * - showNotification: defaults type to "success" when not specified
 * - showNotification: auto-clears notification after the specified duration
 * - useNotification: throws when used outside the provider
 *
 * Mocking:
 *   vi.useFakeTimers() is used to control setTimeout so we can test
 *   the auto-clear behavior without waiting real seconds.
 */

import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { NotificationContextProvider } from "./NotificationContext";
import { useNotification } from "../hooks/useNotification";

// Wrapper that provides NotificationContextProvider around the hook
const wrapper = ({ children }) => <NotificationContextProvider>{children}</NotificationContextProvider>;

describe("NOTIFICATION CONTEXT", () => {
  beforeEach(() => {
    // Use fake timers so we can control setTimeout (used for auto-clear)
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test to avoid leaking into other tests
    vi.useRealTimers();
  });

  test("initial notification state is an empty string", () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    expect(result.current.notification).toBe("");
  });

  test("showNotification sets the notification with message and type", () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.showNotification("Blog created!", 5, "success");
    });

    expect(result.current.notification).toEqual({
      message: "Blog created!",
      type: "success",
    });
  });

  test("showNotification defaults type to 'success' when not specified", () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    // Only pass message and duration — type should default to "success"
    act(() => {
      result.current.showNotification("Default type test", 5);
    });

    expect(result.current.notification).toEqual({
      message: "Default type test",
      type: "success",
    });
  });

  test("showNotification supports 'error' type", () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.showNotification("Something went wrong", 5, "error");
    });

    expect(result.current.notification).toEqual({
      message: "Something went wrong",
      type: "error",
    });
  });

  test("notification auto-clears after the specified duration", () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.showNotification("Temporary message", 3, "success");
    });

    // Notification should still be visible before the timeout
    expect(result.current.notification).toEqual({
      message: "Temporary message",
      type: "success",
    });

    // Advance time by 3 seconds (the duration we specified)
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Notification should now be cleared back to empty string
    expect(result.current.notification).toBe("");
  });

  test("notification does NOT clear before the specified duration", () => {
    const { result } = renderHook(() => useNotification(), { wrapper });

    act(() => {
      result.current.showNotification("Still here", 5, "success");
    });

    // Advance only 4 seconds — notification set for 5 seconds
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Should still be visible
    expect(result.current.notification).toEqual({
      message: "Still here",
      type: "success",
    });
  });

  test("useNotification throws when used outside the provider", () => {
    // Suppress console.error from React's error boundary during this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useNotification());
    }).toThrow("useNotification must be used within NotificationContextProvider");

    consoleSpy.mockRestore();
  });
});
