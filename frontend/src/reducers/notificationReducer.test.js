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
      payload: "Test message",
    });
    expect(state).toBe("Test message");
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
      payload: "Hello",
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
});
