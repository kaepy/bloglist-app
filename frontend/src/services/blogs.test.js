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
 *
 * REFACTORING NOTE: The "should send undefined token when user is not logged in"
 * test documents a current behavior (Bearer undefined) that is arguably a bug.
 * The service should handle null users more gracefully.
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import axios from "axios";
import blogService from "./blogs";
import storage from "./storage";

vi.mock("axios");
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
      axios.get.mockResolvedValue({ data: blogs });

      const result = await blogService.getAll();

      expect(axios.get).toHaveBeenCalledWith("/api/blogs");
      expect(result).toEqual(blogs);
    });

    test("should propagate error when request fails", async () => {
      axios.get.mockRejectedValue(new Error("Network error"));

      await expect(blogService.getAll()).rejects.toThrow("Network error");
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
      axios.post.mockResolvedValue({ data: createdBlog });

      const result = await blogService.create(newBlog);

      expect(axios.post).toHaveBeenCalledWith("/api/blogs", newBlog, {
        headers: { Authorization: "Bearer token123" },
      });
      expect(result).toEqual(createdBlog);
    });

    test("should send undefined token when user is not logged in", async () => {
      storage.loadUser.mockReturnValue(null);
      axios.post.mockResolvedValue({ data: {} });

      await blogService.create({ title: "Test" });

      expect(axios.post).toHaveBeenCalledWith(
        "/api/blogs",
        { title: "Test" },
        { headers: { Authorization: "Bearer undefined" } },
      );
    });
  });

  describe("UPDATE BLOGS", () => {
    test("should update a blog with authorization header", async () => {
      const updatedBlog = { id: 1, title: "Updated Blog", likes: 5 };
      axios.put.mockResolvedValue({ data: updatedBlog });

      const result = await blogService.update(1, updatedBlog);

      expect(axios.put).toHaveBeenCalledWith("/api/blogs/1", updatedBlog, {
        headers: { Authorization: "Bearer token123" },
      });
      expect(result).toEqual(updatedBlog);
    });

    test("should propagate error when update fails", async () => {
      axios.put.mockRejectedValue(new Error("Unauthorized"));

      await expect(blogService.update(1, {})).rejects.toThrow("Unauthorized");
    });
  });

  describe("REMOVE BLOGS", () => {
    test("should delete a blog with authorization header", async () => {
      axios.delete.mockResolvedValue({ data: {} });

      const result = await blogService.remove(1);

      expect(axios.delete).toHaveBeenCalledWith("/api/blogs/1", {
        headers: { Authorization: "Bearer token123" },
      });
      expect(result).toEqual({});
    });

    test("should propagate error when delete fails", async () => {
      axios.delete.mockRejectedValue(new Error("Forbidden"));

      await expect(blogService.remove(1)).rejects.toThrow("Forbidden");
    });
  });
});
