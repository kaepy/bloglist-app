/**
 * @file blogs.test.js
 * Unit tests for the blog HTTP service layer.
 *
 * Axios is fully mocked so no real HTTP requests are made.
 * The storage service is mocked to return a test JWT token.
 *
 * Test coverage:
 * - getAll: fetches from correct URL, handles errors
 * - create: sends POST with auth header, handles missing user
 * - update: sends PUT with auth header, handles errors
 * - remove: sends DELETE with auth header, handles errors
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import { getAll, create, update, remove } from "./blogs";
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

      const result = await getAll();

      expect(fetch).toHaveBeenCalledWith("/api/blogs", {});
      expect(result).toEqual(blogs);
    });

    test("should propagate error when request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Failed to fetch blogs" }),
      });

      await expect(getAll()).rejects.toThrow("Failed to fetch blogs");
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

      const result = await create(newBlog);

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

      await create({ title: "Test" });

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

      const result = await update(1, updatedBlog);

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

      await expect(update(1, {})).rejects.toThrow("Failed to update blog");
    });
  });

  describe("REMOVE BLOGS", () => {
    test("should delete a blog with authorization header", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await remove(1);

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

      await expect(remove(1)).rejects.toThrow("Failed to delete blog");
    });
  });
});
