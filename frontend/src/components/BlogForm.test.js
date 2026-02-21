/**
 * @file BlogForm.test.js
 * Component integration tests for the BlogForm component.
 *
 * Tests verify that:
 * - Submitting the form calls blogService.create with correct data
 * - Form fields are cleared after successful submission
 * - A success notification is shown via NotificationContext
 *
 * Each test creates its own QueryClient for isolation and uses
 * @testing-library/react for DOM queries and user interaction simulation.
 */

import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/** Mock the blog service — must be called before importing the module */
vi.mock("../services/blogs", () => ({
  default: {
    create: vi.fn(),
    getAll: vi.fn(),
  },
  create: vi.fn(),
  getAll: vi.fn(),
}));

/** Mock the useNotification hook */
const mockShowNotification = vi.fn();
vi.mock("../hooks/useNotification", () => ({
  useNotification: () => ({
    notification: "",
    showNotification: mockShowNotification,
  }),
}));

import { create } from "../services/blogs";

describe("BlogForm component", () => {
  const newBlog = {
    title: "Mock Tester",
    author: "Mock the Mocker",
    url: "Blog url",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("when form is submitted with valid data, it should call create service with correct data", async () => {
    const createdBlog = { id: 1, ...newBlog };
    create.mockResolvedValue(createdBlog);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["blogs"], []);

    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <BlogForm />
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

  test("when form is submitted successfully, it should clear all input fields", async () => {
    const createdBlog = { id: 1, ...newBlog };
    create.mockResolvedValue(createdBlog);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["blogs"], []);

    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <BlogForm />
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

  test("when form is submitted successfully, it should show a success notification", async () => {
    const createdBlog = { id: 1, ...newBlog };
    create.mockResolvedValue(createdBlog);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["blogs"], []);

    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <BlogForm />
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
      expect(mockShowNotification).toHaveBeenCalledWith(
        `A new blog "${newBlog.title}" by ${newBlog.author} added!`,
        5,
        "success",
      );
    });
  });
});
