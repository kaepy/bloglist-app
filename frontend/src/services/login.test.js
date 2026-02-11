/**
 * @file login.test.js
 * Unit tests for the login HTTP service.
 *
 * Axios is mocked to verify correct endpoint usage and error propagation
 * without making real network requests.
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import axios from "axios";
import loginService from "./login";

vi.mock("axios");

describe("LOGIN SERVICE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("LOGIN", () => {
    test("should send credentials to /api/login and return user data", async () => {
      const credentials = { username: "testuser", password: "password123" };
      const userData = {
        username: "testuser",
        token: "abc123",
        name: "Test User",
      };
      axios.post.mockResolvedValue({ data: userData });

      const result = await loginService.login(credentials);

      expect(axios.post).toHaveBeenCalledWith("/api/login", credentials);
      expect(result).toEqual(userData);
    });

    test("should throw error on invalid credentials", async () => {
      const credentials = { username: "testuser", password: "wrongpassword" };
      axios.post.mockRejectedValue(new Error("Invalid credentials"));

      await expect(loginService.login(credentials)).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });
});
