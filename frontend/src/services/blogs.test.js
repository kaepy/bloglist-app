/**
 * @file blogs.test.js
 * Unit tests for the blog HTTP service layer.
 *
 * Fetch is fully mocked so no real HTTP requests are made.
 * The storage service is mocked to return a test JWT token.
 *
 * Test coverage:
 * - getAllBlogs: fetches from correct URL, handles errors
 * - createBlog: sends POST with auth header, handles missing user
 * - updateBlog: sends PUT with auth header, handles errors
 * - commentBlog: sends POST to comments endpoint with auth header
 * - removeBlog: sends DELETE with auth header, handles errors
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import { getAllBlogs, createBlog, updateBlog, commentBlog, removeBlog } from "./blogs";
import storage from "./storage";

vi.mock("./storage");

describe("BLOGS SERVICE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock storage.loadUser to return a user with a token
    storage.loadUser.mockReturnValue({ token: "token123" });
  });

  describe("GET ALL BLOGS", () => {
    test("should fetch all blogs from /api/blogs", async () => {
      const blogs = [
        { id: 1, title: "Blog 1" },
        { id: 2, title: "Blog 2" },
      ];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(blogs),
      });

      const result = await getAllBlogs();

      expect(fetch).toHaveBeenCalledWith("/api/blogs", {});
      expect(result).toEqual(blogs);
    });

    test("should propagate error when request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Failed to fetch blogs" }),
      });

      await expect(getAllBlogs()).rejects.toThrow("Failed to fetch blogs");
    });
  });

  describe("CREATE BLOGS", () => {
    test("should create a new blog with authorization header", async () => {
      const newBlog = {
        title: "New Blog",
        author: "Author",
        url: "http://test.com",
      };
      const createdBlog = { id: 1, ...newBlog };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createdBlog),
      });

      const result = await createBlog(newBlog);

      expect(fetch).toHaveBeenCalledWith("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
        body: JSON.stringify(newBlog),
      });
      expect(result).toEqual(createdBlog);
    });

    test("should not send Authorization header when user is not logged in", async () => {
      storage.loadUser.mockReturnValue(null);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await createBlog({ title: "Test" });

      expect(fetch).toHaveBeenCalledWith("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Test" }),
      });
    });
  });

  describe("UPDATE BLOGS", () => {
    test("should update a blog with authorization header", async () => {
      const updatedBlog = { id: 1, title: "Updated Blog", likes: 5 };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(updatedBlog),
      });

      const result = await updateBlog(1, updatedBlog);

      expect(fetch).toHaveBeenCalledWith("/api/blogs/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
        body: JSON.stringify(updatedBlog),
      });
      expect(result).toEqual(updatedBlog);
    });

    test("should propagate error when update fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Failed to update blog" }),
      });

      await expect(updateBlog(1, {})).rejects.toThrow("Failed to update blog");
    });
  });

  describe("REMOVE BLOGS", () => {
    test("should delete a blog with authorization header", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await removeBlog(1);

      expect(fetch).toHaveBeenCalledWith("/api/blogs/1", {
        method: "DELETE",
        headers: { Authorization: "Bearer token123" },
      });
      expect(result).toEqual({});
    });

    test("should propagate error when delete fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Failed to delete blog" }),
      });

      await expect(removeBlog(1)).rejects.toThrow("Failed to delete blog");
    });
  });

  describe("COMMENT ON BLOGS", () => {
    test("should add a comment to a blog with authorization header", async () => {
      const blogWithComment = {
        id: 1,
        title: "Test Blog",
        comments: ["Great post!"],
      };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(blogWithComment),
      });

      const result = await commentBlog(1, "Great post!");

      expect(fetch).toHaveBeenCalledWith("/api/blogs/1/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token123",
        },
        body: JSON.stringify({ comment: "Great post!" }),
      });
      expect(result).toEqual(blogWithComment);
    });

    test("should not send Authorization header when user is not logged in", async () => {
      storage.loadUser.mockReturnValue(null);
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await commentBlog(1, "Nice post");

      expect(fetch).toHaveBeenCalledWith("/api/blogs/1/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: "Nice post" }),
      });
    });

    test("should propagate error when comment fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Failed to add comment" }),
      });

      await expect(commentBlog(1, "Test comment")).rejects.toThrow(
        "Failed to add comment",
      );
    });
  });
});
