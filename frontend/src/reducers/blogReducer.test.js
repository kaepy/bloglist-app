/**
 * @file blogReducer.test.js
 * Unit tests for the blog Redux slice (reducer + async thunks).
 *
 * Reducer tests dispatch raw action objects to verify state transitions.
 * Thunk tests mock the blog service and verify that the correct actions
 * and service calls are made (including error paths).
 *
 * Run: npm test -- --testPathPattern=blogReducer.test.js
 *
 * REFACTORING NOTES:
 * - Thunk tests manually create a dispatch mock and call the thunk.
 *   Consider using @reduxjs/toolkit's configureStore with the reducer
 *   to test thunks against a real store for higher confidence.
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import blogService from "../services/blogs";
import blogReducer, {
  initializeBlogs,
  appendBlog,
  voteBlog,
  destroyBlog,
} from "./blogReducer.js";

/** Mock the entire blogs service module */
vi.mock("../services/blogs");

describe("BLOG REDUCER", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("should return the initial state when called with undefined state", () => {
    const newState = blogReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(newState).toEqual([]);
  });

  test("should handle setBlogs action", () => {
    const initialState = [];
    const blogs = [
      { id: 1, title: "Test Blog 1" },
      { id: 2, title: "Test Blog 2" },
    ];
    const action = {
      type: "blogs/setBlogs",
      payload: blogs,
    };
    const newState = blogReducer(initialState, action);
    expect(newState).toEqual(blogs);
  });

  test("should handle createBlog action", () => {
    const initialState = [{ id: 1, title: "Existing Blog" }];
    const newBlog = { id: 2, title: "New Blog" };
    const action = {
      type: "blogs/createBlog",
      payload: newBlog,
    };
    const newState = blogReducer(initialState, action);
    expect(newState).toEqual([...initialState, newBlog]);
  });

  test("should handle updateBlog action", () => {
    const initialState = [
      { id: "1", title: "Blog 1", likes: 0 },
      { id: "2", title: "Blog 2", likes: 3 },
    ];
    const updatedBlog = { id: "2", title: "Blog 2", likes: 4 };
    const action = {
      type: "blogs/updateBlog",
      payload: updatedBlog,
    };
    const newState = blogReducer(initialState, action);
    expect(newState).toEqual([
      { id: "1", title: "Blog 1", likes: 0 },
      updatedBlog,
    ]);
  });

  test("should handle deleteBlog action", () => {
    const initialState = [
      { id: "1", title: "Blog 1" },
      { id: "2", title: "Blog 2" },
    ];
    const action = {
      type: "blogs/deleteBlog",
      payload: "2",
    };
    const newState = blogReducer(initialState, action);
    expect(newState).toEqual([{ id: "1", title: "Blog 1" }]);
  });

  describe("ASYNC THUNKS", () => {
    test("initializeBlogs fetches blogs and dispatches setBlogs", async () => {
      const blogs = [
        { id: 1, title: "Blog 1", author: "Author 1" },
        { id: 2, title: "Blog 2", author: "Author 2" },
      ];
      blogService.getAll.mockResolvedValue(blogs);

      const dispatch = vi.fn();
      const thunk = initializeBlogs();

      await thunk(dispatch);

      expect(blogService.getAll).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: "blogs/setBlogs",
        payload: blogs,
      });
    });

    test("initializeBlogs throws error when service fails", async () => {
      blogService.getAll.mockRejectedValue(new Error("Network error"));

      const dispatch = vi.fn();
      const thunk = initializeBlogs();

      await expect(thunk(dispatch)).rejects.toThrow("Network error");
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("addBlog creates blog and dispatches createBlog", async () => {
      const newBlogContent = {
        title: "New Blog",
        author: "Test Author",
        url: "http://test.com",
      };
      const createdBlog = { id: 1, ...newBlogContent };
      blogService.create.mockResolvedValue(createdBlog);

      const dispatch = vi.fn();
      const thunk = appendBlog(newBlogContent);

      await thunk(dispatch);

      expect(blogService.create).toHaveBeenCalledWith(newBlogContent);
      expect(dispatch).toHaveBeenCalledWith({
        type: "blogs/createBlog",
        payload: createdBlog,
      });
    });

    test("appendBlog throws error when service fails", async () => {
      const newBlogContent = {
        title: "New Blog",
        author: "Author",
        url: "http://test.com",
      };
      blogService.create.mockRejectedValue(new Error("Unauthorized"));

      const dispatch = vi.fn();
      const thunk = appendBlog(newBlogContent);

      await expect(thunk(dispatch)).rejects.toThrow("Unauthorized");
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("voteBlog updates blog and dispatches updateBlog", async () => {
      const blogObject = {
        id: "1",
        title: "Blog 1",
        author: "Author",
        url: "http://test.com",
        likes: 6,
        user: "user1",
      };
      const updatedBlog = { ...blogObject, likes: 6 };
      blogService.update.mockResolvedValue(updatedBlog);

      const dispatch = vi.fn();
      await voteBlog(blogObject)(dispatch);

      expect(blogService.update).toHaveBeenCalledWith("1", blogObject);
      expect(dispatch).toHaveBeenCalledWith({
        type: "blogs/updateBlog",
        payload: updatedBlog,
      });
    });

    test("voteBlog throws error when service fails", async () => {
      const blogObject = { id: "1", title: "Blog 1", likes: 6, user: "user1" };
      blogService.update.mockRejectedValue(new Error("Server error"));

      const dispatch = vi.fn();

      await expect(voteBlog(blogObject)(dispatch)).rejects.toThrow(
        "Server error",
      );
      expect(dispatch).not.toHaveBeenCalled();
    });

    test("destroyBlog removes blog and dispatches deleteBlog", async () => {
      blogService.remove.mockResolvedValue({});

      const dispatch = vi.fn();
      await destroyBlog("1")(dispatch);

      expect(blogService.remove).toHaveBeenCalledWith("1");
      expect(dispatch).toHaveBeenCalledWith({
        type: "blogs/deleteBlog",
        payload: "1",
      });
    });

    test("destroyBlog throws error when service fails", async () => {
      blogService.remove.mockRejectedValue(new Error("Forbidden"));

      const dispatch = vi.fn();

      await expect(destroyBlog("1")(dispatch)).rejects.toThrow("Forbidden");
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
