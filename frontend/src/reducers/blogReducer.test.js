import { describe, expect, test, vi, beforeEach } from "vitest";
import blogService from "../services/blogs";
import blogReducer, { initializeBlogs, appendBlog } from "./blogReducer.js";

// Mock the blogs service
vi.mock("../services/blogs");

// run only this test file: npm test -- --testPathPattern=blogReducer.test.js

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
      const newBlogContent = { title: "New Blog", author: "Author", url: "http://test.com" };
      blogService.create.mockRejectedValue(new Error("Unauthorized"));

      const dispatch = vi.fn();
      const thunk = appendBlog(newBlogContent);

      await expect(thunk(dispatch)).rejects.toThrow("Unauthorized");
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
