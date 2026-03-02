/**
 * @file Notification.test.jsx
 * Tests for the Notification component.
 *
 * Tests cover:
 * - Renders nothing when there is no active notification
 * - Renders the notification message when one is set
 * - Uses green color for "success" notifications
 * - Uses red color for "error" notifications
 *
 * Notification reads from NotificationContext, so each test renders
 * it inside NotificationContextProvider. A small helper component
 * (NotificationTrigger) calls showNotification so we can set the
 * notification state from within the test without direct context access.
 */

import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NotificationContextProvider } from "../contexts/NotificationContext";
import { useNotification } from "../hooks/useNotification";
import Notification from "./Notification";

/**
 * Helper component rendered alongside Notification.
 * Provides a button that triggers showNotification with given props,
 * so tests can set notification state without bypassing the context API.
 */
const NotificationTrigger = ({ message, type }) => {
  const { showNotification } = useNotification();
  return <button onClick={() => showNotification(message, 60, type)}>trigger</button>;
};

/**
 * Renders Notification and NotificationTrigger inside the provider.
 * Returns a function to trigger the notification via button click.
 */
const renderNotification = (message, type) => {
  const userEvt = userEvent.setup();

  render(
    <NotificationContextProvider>
      <NotificationTrigger message={message} type={type} />
      <Notification />
    </NotificationContextProvider>,
  );

  const trigger = () => userEvt.click(screen.getByText("trigger"));
  return { trigger };
};

describe("Notification", () => {
  test("renders nothing when there is no notification", () => {
    render(
      <NotificationContextProvider>
        <Notification />
      </NotificationContextProvider>,
    );

    // The component returns null — no notification div in the DOM
    expect(document.querySelector("[style]")).toBeNull();
  });

  test("renders the notification message when set", async () => {
    const { trigger } = renderNotification("Blog created!", "success");

    await trigger();

    expect(screen.getByText("Blog created!")).toBeTruthy();
  });

  test("uses green color for success notifications", async () => {
    const { trigger } = renderNotification("Success message", "success");

    await trigger();

    // MUI Alert uses CSS classes instead of inline styles for severity coloring
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-colorSuccess");
  });

  test("uses red color for error notifications", async () => {
    const { trigger } = renderNotification("Error message", "error");

    await trigger();

    // MUI Alert uses CSS classes instead of inline styles for severity coloring
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("MuiAlert-colorError");
  });
});
