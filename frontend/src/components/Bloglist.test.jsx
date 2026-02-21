/**
 * @file Bloglist.test.jsx
 * Tests for the Bloglist component.
 *
 * Tests cover:
 * - Shows a loading indicator while blogs are being fetched
 * - Renders all blogs once data is loaded
 * - Renders blogs sorted by likes in descending order
 *
 * Bloglist uses useQuery (needs QueryClientProvider) and renders Blog
 * components which need UserContextProvider and NotificationContextProvider.
 * The getAll service function is mocked to control what data is returned.
 *
 * Why we seed QueryClient directly (instead of just mocking getAll):
 *   Pre-seeding queryClient.setQueryData(["blogs"], ...) lets us skip
 *   the async fetch cycle entirely for tests that only care about rendering.
 *   For the loading test, we use a mock that never resolves.
 */

import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserContextProvider } from "../contexts/UserContext";
import { NotificationContextProvider } from "../contexts/NotificationContext";
import storage from "../services/storage";
import * as blogService from "../services/blogs";
import Bloglist from "./Bloglist";

vi.mock("../services/blogs", () => ({
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

vi.mock("../services/storage");

/** Sample blogs — ordered intentionally NOT by likes to test sorting */
const blogs = [
  {
    id: "1",
    title: "First Blog",
    author: "Author A",
    url: "http://a.com",
    likes: 3,
    user: { username: "u1", id: "u1" },
  },
  {
    id: "2",
    title: "Second Blog",
    author: "Author B",
    url: "http://b.com",
    likes: 10,
    user: { username: "u2", id: "u2" },
  },
  {
    id: "3",
    title: "Third Blog",
    author: "Author C",
    url: "http://c.com",
    likes: 1,
    user: { username: "u3", id: "u3" },
  },
];

/**
 * Renders Bloglist inside all required providers.
 * Accepts a pre-configured QueryClient so each test can control cache state.
 */
const renderBloglist = (queryClient) => {
  storage.loadUser.mockReturnValue(null); // No logged-in user needed for these tests

  render(
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <NotificationContextProvider>
          <Bloglist />
        </NotificationContextProvider>
      </UserContextProvider>
    </QueryClientProvider>,
  );
};

describe("Bloglist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows loading indicator while fetching blogs", () => {
    // Mock getAll to return a promise that never resolves, keeping query in loading state
    blogService.getAll.mockReturnValue(new Promise(() => {}));

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderBloglist(queryClient);

    expect(screen.getByText("loading blogs...")).toBeTruthy();
  });

  test("renders all blogs once data is loaded", () => {
    // Mock getAll so background refetch also returns valid data (prevents React Query warnings)
    blogService.getAll.mockResolvedValue(blogs);

    const queryClient = new QueryClient();
    // Pre-seed the cache so Bloglist renders immediately without waiting for the fetch
    queryClient.setQueryData(["blogs"], blogs);

    renderBloglist(queryClient);

    expect(screen.getByText("First Blog", { exact: false })).toBeTruthy();
    expect(screen.getByText("Second Blog", { exact: false })).toBeTruthy();
    expect(screen.getByText("Third Blog", { exact: false })).toBeTruthy();
  });

  test("renders blogs sorted by likes in descending order", () => {
    blogService.getAll.mockResolvedValue(blogs);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["blogs"], blogs);

    renderBloglist(queryClient);

    // Get all blog title text from the rendered list
    const blogElements = document.querySelectorAll(".blog");
    const renderedTitles = Array.from(blogElements).map((el) => el.textContent);

    // "Second Blog" (10 likes) should appear before "First Blog" (3 likes)
    // and "First Blog" before "Third Blog" (1 like)
    const secondIndex = renderedTitles.findIndex((t) => t.includes("Second Blog"));
    const firstIndex = renderedTitles.findIndex((t) => t.includes("First Blog"));
    const thirdIndex = renderedTitles.findIndex((t) => t.includes("Third Blog"));

    expect(secondIndex).toBeLessThan(firstIndex);
    expect(firstIndex).toBeLessThan(thirdIndex);
  });
});
