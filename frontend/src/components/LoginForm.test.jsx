/**
 * @file LoginForm.test.jsx
 * Tests for the LoginForm component.
 *
 * Tests cover:
 * - Renders username and password inputs, and the login button
 * - Calls handleLogin prop with the correct credentials on submit
 * - Clears both input fields after submission
 *
 * LoginForm is a pure presentational component — it manages local
 * input state and delegates login logic to the parent via handleLogin.
 * No providers are needed since it doesn't use any context or React Query.
 */

import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  test("renders username input, password input, and login button", () => {
    render(<LoginForm handleLogin={vi.fn()} />);

    expect(document.querySelector("#username")).toBeTruthy();
    expect(document.querySelector("#password")).toBeTruthy();
    expect(screen.getByText("Login")).toBeTruthy();
  });

  test("calls handleLogin with entered credentials on submit", async () => {
    const handleLogin = vi.fn();
    const userEvt = userEvent.setup();

    render(<LoginForm handleLogin={handleLogin} />);

    await userEvt.type(document.querySelector("#username"), "testuser");
    await userEvt.type(document.querySelector("#password"), "secret");
    await userEvt.click(screen.getByText("Login"));

    expect(handleLogin).toHaveBeenCalledOnce();
    expect(handleLogin).toHaveBeenCalledWith({
      username: "testuser",
      password: "secret",
    });
  });

  test("clears input fields after submission", async () => {
    const userEvt = userEvent.setup();

    render(<LoginForm handleLogin={vi.fn()} />);

    const usernameInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");

    await userEvt.type(usernameInput, "testuser");
    await userEvt.type(passwordInput, "secret");
    await userEvt.click(screen.getByText("Login"));

    // Fields should be cleared after submit
    expect(usernameInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });
});
