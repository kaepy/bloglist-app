/**
 * @file Blog.test.js
 * Component integration tests for the Blog component.
 *
 * Each test renders the Blog component inside a real Redux Provider
 * (with a configured store) and simulates user interactions.
 *
 * Mock setup:
 * - blogService.update and blogService.remove are mocked to prevent
 *   actual HTTP requests while verifying they're called correctly.
 * - A test user is dispatched to the store so ownership logic works.
 *
 * Test coverage:
 * - Renders title in collapsed view
 * - Expands details on "view" button click
 * - Like button calls update service (verifies double-click = 2 calls)
 * - Remove button triggers confirm dialog and calls remove service
 *
 * REFACTORING NOTES:
 * - The renderBlog helper creates a new store per test, which is good
 *   for isolation. Consider extracting it into a shared test util.
 * - The blog and user test data are defined at module scope, meaning
 *   all tests share the same objects. This is fine for read-only data
 *   but could cause issues if any test mutates them.
 */

import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../reducers/blogReducer";
import notificationReducer from "../reducers/notificationReducer";
import userReducer, { setUser } from "../reducers/userReducer";

import Blog from "./Blog";
import blogService from "../services/blogs";

/** Mock blog service to intercept HTTP calls */
vi.mock("../services/blogs", () => ({
  default: {
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

/** Test data: a sample blog owned by testuser */
const blog = {
  id: "123",
  title: "Testing Blog Component",
  author: "Test Author",
  url: "http://test.com",
  likes: 5,
  user: {
    username: "testuser",
    id: "user123",
  },
};

/** The user who owns the test blog */
const user = { username: "testuser" };

/**
 * Helper: creates a fresh Redux store, dispatches the test user,
 * and renders the Blog component with the provided test data.
 */
const renderBlog = () => {
  const store = configureStore({
    reducer: {
      blogs: blogReducer,
      notification: notificationReducer,
      user: userReducer,
    },
  });

  store.dispatch(setUser(user));

  render(
    <Provider store={store}>
      <Blog blog={blog} />
    </Provider>,
  );

  return store;
};

describe("Blog Component", () => {
  test("renders title", () => {
    renderBlog();
    expect(
      screen.getByText("Testing Blog Component", { exact: false }),
    ).toBeDefined();
  });

  test("renders content when view button is pressed", async () => {
    renderBlog();
    const userEvt = userEvent.setup();

    const viewButton = screen.getByText("view", { exact: false });
    await userEvt.click(viewButton);

    expect(screen.getByText("author: Test Author")).toBeDefined();
    expect(screen.getByText("http://test.com", { exact: false })).toBeDefined();
    expect(screen.getByText("likes: 5", { exact: false })).toBeDefined();
  });

  test("renders likes when like button is double clicked", async () => {
    const updatedBlog = { ...blog, likes: 6 };
    blogService.update.mockResolvedValue(updatedBlog);

    renderBlog();
    const userEvt = userEvent.setup();

    const viewButton = screen.getByText("view", { exact: false });
    await userEvt.click(viewButton);

    const likeButton = screen.getByText("like");
    await userEvt.click(likeButton);
    await userEvt.click(likeButton);

    expect(blogService.update).toHaveBeenCalledTimes(2);
  });

  test("calls removeBlog when remove button is clicked", async () => {
    blogService.remove.mockResolvedValue({});
    window.confirm = vi.fn(() => true);

    renderBlog();
    const userEvt = userEvent.setup();

    const viewButton = screen.getByText("view", { exact: false });
    await userEvt.click(viewButton);

    const removeButton = screen.getByText("remove");
    await userEvt.click(removeButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(blogService.remove).toHaveBeenCalledWith("123");
  });
});
