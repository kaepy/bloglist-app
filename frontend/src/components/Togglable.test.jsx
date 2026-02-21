/**
 * @file Togglable.test.jsx
 * Tests for the Togglable component.
 *
 * Tests cover:
 * - Initially renders the toggle button and hides content
 * - Clicking the toggle button shows the content and cancel button
 * - Clicking the cancel button hides the content again
 * - The ref-exposed toggleVisibility() method works programmatically
 *
 * Togglable uses forwardRef + useImperativeHandle to expose
 * toggleVisibility() to parent components. We test both the
 * click-based interaction and the ref-based programmatic toggle.
 *
 * No providers needed — Togglable has no context or React Query dependencies.
 */

import { describe, expect, test } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import Togglable from "./Togglable";

describe("Togglable", () => {
  test("renders the toggle button and hides content initially", () => {
    render(
      <Togglable buttonLabel="Show form">
        <div>Hidden content</div>
      </Togglable>,
    );

    // The "Show form" button should be visible
    expect(screen.getByText("Show form")).toBeTruthy();

    // The content and cancel button are in the DOM but hidden via display:none
    const contentWrapper = document.querySelector(".togglableContent");
    expect(contentWrapper.style.display).toBe("none");
  });

  test("shows content and cancel button when toggle button is clicked", async () => {
    const userEvt = userEvent.setup();

    render(
      <Togglable buttonLabel="Show form">
        <div>Hidden content</div>
      </Togglable>,
    );

    await userEvt.click(screen.getByText("Show form"));

    // Content wrapper should now be visible
    const contentWrapper = document.querySelector(".togglableContent");
    expect(contentWrapper.style.display).toBe("");

    // Content and cancel button are visible
    expect(screen.getByText("Hidden content")).toBeTruthy();
    expect(screen.getByText("cancel")).toBeTruthy();
  });

  test("hides content when cancel button is clicked", async () => {
    const userEvt = userEvent.setup();

    render(
      <Togglable buttonLabel="Show form">
        <div>Hidden content</div>
      </Togglable>,
    );

    // Open it first
    await userEvt.click(screen.getByText("Show form"));
    expect(document.querySelector(".togglableContent").style.display).toBe("");

    // Then close with cancel
    await userEvt.click(screen.getByText("cancel"));
    expect(document.querySelector(".togglableContent").style.display).toBe("none");
  });

  test("toggleVisibility ref method toggles visibility programmatically", async () => {
    const togglableRef = createRef();

    render(
      <Togglable buttonLabel="Show form" ref={togglableRef}>
        <div>Ref-toggled content</div>
      </Togglable>,
    );

    // Initially hidden
    expect(document.querySelector(".togglableContent").style.display).toBe("none");

    // Toggle open via ref — wrapped in act() because it triggers a React state update
    act(() => togglableRef.current.toggleVisibility());
    expect(document.querySelector(".togglableContent").style.display).toBe("");

    // Toggle closed via ref
    act(() => togglableRef.current.toggleVisibility());
    expect(document.querySelector(".togglableContent").style.display).toBe("none");
  });
});
