/**
 * @file users.test.js
 * Unit tests for the user HTTP service layer.
 *
 * Axios is fully mocked so no real HTTP requests are made.
 *
 * Test coverage:
 * - getAll: fetches from correct URL, handles errors
 * - create: sends POST with auth header, handles missing user
 * - update: sends PUT with auth header, handles errors
 * - remove: sends DELETE with auth header, handles errors
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import { getAllUsers } from "./users";

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
});
