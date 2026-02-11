/**
 * @file BlogForm.test.js
 * Component integration tests for the BlogForm component.
 *
 * Tests verify that:
 * - Submitting the form calls blogService.create with correct data
 * - Form fields are cleared after successful submission
 * - A success notification is dispatched to the Redux store
 *
 * Each test creates its own Redux store for isolation and uses
 * @testing-library/react for DOM queries and user interaction simulation.
 *
 * REFACTORING NOTES:
 * - All three tests repeat the same store setup, render, and form-fill
 *   logic. Extract a shared helper (similar to Blog.test.js's renderBlog)
 *   to reduce ~40 lines of duplication.
 * - The mock setup imports blogService after vi.mock() — this ordering
 *   is required by Vitest's hoisting behavior and should not be changed.
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../reducers/blogReducer";
import notificationReducer from "../reducers/notificationReducer";
import userReducer from "../reducers/userReducer";

/** Mock the blog service — must be called before importing the module */
vi.mock("../services/blogs", () => ({
  default: {
    create: vi.fn(),
    getAll: vi.fn(),
  },
}));

import blogService from "../services/blogs";

describe("TESTING NEW BLOG FORM COMPONENT", () => {
  const newBlog = {
    title: "Mock Tester",
    author: "Mock the Mocker",
    url: "Blog url",
  };

  test("<BlogForm /> create new blog", async () => {
    const createdBlog = { id: 1, ...newBlog };
    blogService.create.mockResolvedValue(createdBlog);

    const store = configureStore({
      reducer: {
        blogs: blogReducer,
        notification: notificationReducer,
        user: userReducer,
      },
    });

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BlogForm />
      </Provider>,
    );

    //screen.debug()

    const title = screen.getByPlaceholderText("placeholder title");
    const author = screen.getByPlaceholderText("placeholder author");
    const url = screen.getByPlaceholderText("placeholder url");
    const createButton = screen.getByText("create");

    await user.type(title, newBlog.title);
    await user.type(author, newBlog.author);
    await user.type(url, newBlog.url);
    await user.click(createButton);

    //screen.debug()

    // Wait for async dispatch to complete
    await waitFor(() => {
      // Verify blog service was called with correct data
      expect(blogService.create).toHaveBeenCalledWith({
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
      });
    });
  });

  test("form clears after submission", async () => {
    const createdBlog = { id: 1, ...newBlog };
    blogService.create.mockResolvedValue(createdBlog);

    const store = configureStore({
      reducer: {
        blogs: blogReducer,
        notification: notificationReducer,
        user: userReducer,
      },
    });

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BlogForm />
      </Provider>,
    );

    const title = screen.getByPlaceholderText("placeholder title");
    const author = screen.getByPlaceholderText("placeholder author");
    const url = screen.getByPlaceholderText("placeholder url");
    const createButton = screen.getByText("create");

    await user.type(title, newBlog.title);
    await user.type(author, newBlog.author);
    await user.type(url, newBlog.url);
    await user.click(createButton);

    await waitFor(() => {
      expect(title).toHaveValue("");
      expect(author).toHaveValue("");
      expect(url).toHaveValue("");
    });
  });

  test("notification is displayed after submission", async () => {
    const createdBlog = { id: 1, ...newBlog };
    blogService.create.mockResolvedValue(createdBlog);

    const store = configureStore({
      reducer: {
        blogs: blogReducer,
        notification: notificationReducer,
        user: userReducer,
      },
    });

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BlogForm />
      </Provider>,
    );

    const title = screen.getByPlaceholderText("placeholder title");
    const author = screen.getByPlaceholderText("placeholder author");
    const url = screen.getByPlaceholderText("placeholder url");
    const createButton = screen.getByText("create");

    await user.type(title, newBlog.title);
    await user.type(author, newBlog.author);
    await user.type(url, newBlog.url);
    await user.click(createButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.notification).toEqual({
        message: `A new blog "${newBlog.title}" by ${newBlog.author} added`,
        type: "success",
      });
    });
  });
});
