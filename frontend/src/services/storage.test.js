import { describe, expect, test, vi, beforeEach } from "vitest";
import storage from "./storage";

describe("STORAGE SERVICE", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("SAVE USER", () => {
    test("should save user to localStorage", () => {
      const user = { username: "testuser", token: "abc123" };

      storage.saveUser(user);

      const saved = JSON.parse(localStorage.getItem("blogUserKey"));
      expect(saved).toEqual(user);
    });
  });

  describe("LOAD USER", () => {
    test("should load user from localStorage", () => {
      const user = { username: "testuser", token: "abc123" };
      localStorage.setItem("blogUserKey", JSON.stringify(user));

      const result = storage.loadUser();

      expect(result).toEqual(user);
    });

    test("should return null when no user is stored", () => {
      const result = storage.loadUser();

      expect(result).toBeNull();
    });
  });

  describe("GET USERNAME", () => {
    test("should return username when user is stored", () => {
      const user = { username: "testuser", token: "abc123" };
      localStorage.setItem("blogUserKey", JSON.stringify(user));

      const result = storage.getUsername();

      expect(result).toBe("testuser");
    });

    test("should return null when no user is stored", () => {
      const result = storage.getUsername();

      expect(result).toBeNull();
    });
  });

  describe("REMOVE USER", () => {
    test("should remove user from localStorage", () => {
      const user = { username: "testuser", token: "abc123" };
      localStorage.setItem("blogUserKey", JSON.stringify(user));

      storage.removeUser();

      expect(localStorage.getItem("blogUserKey")).toBeNull();
    });
  });
});
