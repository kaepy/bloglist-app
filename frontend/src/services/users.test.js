/**
 * @file users.test.js
 * Unit tests for the user HTTP service layer.
 *
 * globalThis.fetch is mocked per-test so no real HTTP requests are made.
 *
 * Test coverage:
 * - getAllUsers: fetches from correct URL, handles errors
 * - getUserById: fetches from correct URL with ID, handles errors
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import { getAllUsers, getUserById } from "./users";

describe("USERS SERVICE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET ALL USERS", () => {
    test("should fetch all users from /api/users", async () => {
      const users = [
        { id: 1, username: "User 1" },
        { id: 2, username: "User 2" },
      ];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(users),
      });

      const result = await getAllUsers();

      expect(fetch).toHaveBeenCalledWith("/api/users", {});
      expect(result).toEqual(users);
    });

    test("should propagate error when request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Failed to fetch users" }),
      });

      await expect(getAllUsers()).rejects.toThrow("Failed to fetch users");
    });
  });

  describe("GET USER BY ID", () => {
    test("should fetch a single user from /api/users/:id", async () => {
      const user = {
        id: "abc123",
        username: "testuser",
        blogs: [{ id: "b1", title: "My Blog" }],
      };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(user),
      });

      const result = await getUserById("abc123");

      expect(fetch).toHaveBeenCalledWith("/api/users/abc123", {});
      expect(result).toEqual(user);
    });

    test("should propagate error when request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: "User not found" }),
      });

      await expect(getUserById("nonexistent")).rejects.toThrow("User not found");
    });
  });
});
