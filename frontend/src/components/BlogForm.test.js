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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import blogReducer from "../reducers/blogReducer";
import notificationReducer from "../reducers/notificationReducer";
import userReducer from "../reducers/userReducer";

/** Mock the blog service — must be called before importing the module */
vi.mock("../services/blogs", () => ({
  default: {
    create: vi.fn(),
    getAll: vi.fn(),
  },
  create: vi.fn(),
  getAll: vi.fn(),
}));

import { create } from "../services/blogs";

describe("TESTING NEW BLOG FORM COMPONENT", () => {
  const newBlog = {
    title: "Mock Tester",
    author: "Mock the Mocker",
    url: "Blog url",
  };

  test("<BlogForm /> create new blog", async () => {
    const createdBlog = { id: 1, ...newBlog };
    create.mockResolvedValue(createdBlog);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["blogs"], []);
    const store = configureStore({
      reducer: {
        blogs: blogReducer,
        notification: notificationReducer,
        user: userReducer,
      },
    });

    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BlogForm />
        </Provider>
      </QueryClientProvider>,
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
      // React Query passes mutation context as second arg, so check first arg only
      expect(create).toHaveBeenCalled();
      expect(create.mock.calls[0][0]).toEqual({
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
      });
    });
  });

  test("form clears after submission", async () => {
    const createdBlog = { id: 1, ...newBlog };
    create.mockResolvedValue(createdBlog);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["blogs"], []);
    const store = configureStore({
      reducer: {
        blogs: blogReducer,
        notification: notificationReducer,
        user: userReducer,
      },
    });

    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BlogForm />
        </Provider>
      </QueryClientProvider>,
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
    create.mockResolvedValue(createdBlog);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["blogs"], []);
    const store = configureStore({
      reducer: {
        blogs: blogReducer,
        notification: notificationReducer,
        user: userReducer,
      },
    });

    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BlogForm />
        </Provider>
      </QueryClientProvider>,
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
        message: `A new blog "${newBlog.title}" by ${newBlog.author} added!`,
        type: "success",
      });
    });
  });
});
