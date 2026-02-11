import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../reducers/blogReducer";
import notificationReducer from "../reducers/notificationReducer";

import Blog from "./Blog";
import blogService from "../services/blogs";

vi.mock("../services/blogs", () => ({
  default: {
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

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

const user = { username: "testuser" };

const renderBlog = () => {
  const store = configureStore({
    reducer: {
      blogs: blogReducer,
      notification: notificationReducer,
    },
  });

  render(
    <Provider store={store}>
      <Blog user={user} blog={blog} />
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
