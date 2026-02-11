/**
 * @file notificationReducer.test.js
 * Unit tests for the notification Redux slice and the showNotification thunk.
 *
 * Reducer tests verify state transitions for setNotification and clearNotification.
 * Thunk tests use vi.useFakeTimers() to precisely control setTimeout behavior
 * and verify that notifications auto-dismiss at the correct time.
 *
 * Key scenarios tested:
 * - Initial state is null
 * - Setting and clearing notifications
 * - Auto-dismiss timing with fake timers
 * - New notifications correctly cancel previous timeouts
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import notificationReducer, { showNotification } from "./notificationReducer";

describe("NOTIFICATION REDUCER", () => {
  test("should return the initial state", () => {
    const state = notificationReducer(undefined, { type: "unknown" });
    expect(state).toBe(null);
  });

  test("setNotification sets the message", () => {
    const state = notificationReducer(null, {
      type: "notification/setNotification",
      payload: { message: "Test message", type: "success" },
    });
    expect(state).toEqual({ message: "Test message", type: "success" });
  });

  test("clearNotification clears the message", () => {
    const state = notificationReducer("existing message", {
      type: "notification/clearNotification",
    });
    expect(state).toBe(null);
  });
});

describe("SHOW NOTIFICATION THUNK", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("dispatches setNotification immediately", () => {
    const dispatch = vi.fn();
    showNotification("Hello", 5)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "notification/setNotification",
      payload: { message: "Hello", type: "success" },
    });
  });

  test("does not dispatch clearNotification before duration ends", () => {
    const dispatch = vi.fn();
    showNotification("Hello", 5)(dispatch);

    vi.advanceTimersByTime(4999); // 1ms before timeout

    expect(dispatch).toHaveBeenCalledTimes(1); // Still only the initial call
  });

  test("dispatches clearNotification after specified duration", () => {
    const dispatch = vi.fn();
    showNotification("Hello", 5)(dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5000);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "notification/clearNotification",
    });
  });

  test("new notification cancels previous timeout", () => {
    const dispatch = vi.fn();

    showNotification("First", 5)(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(1);

    // 3 seconds in, send a new notification
    vi.advanceTimersByTime(3000);
    showNotification("Second", 5)(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(2);

    // 2 more seconds — the first timeout (5s) would have fired here
    vi.advanceTimersByTime(2000);
    // Should NOT have cleared — only 2s into the second notification's 5s timer
    expect(dispatch).toHaveBeenCalledTimes(2);

    // 3 more seconds — now the second timeout (5s) fires
    vi.advanceTimersByTime(3000);
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "notification/clearNotification",
    });
  });
});
