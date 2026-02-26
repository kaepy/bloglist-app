/**
 * @file Blog.test.jsx
 * Integration tests for the Blog detail page component.
 *
 * The component reads :id from useParams, fetches via useQuery, and
 * renders full blog details with like/remove mutations. Tests are
 * rendered inside a real route (<Route path="/blogs/:id">) so useParams
 * and useNavigate work without mocking react-router-dom.
 *
 * Gotcha: both mutations call queryClient.getQueryData(["blogs"]) and
 * chain .map()/.filter() on the result. Always pre-seed the ["blogs"]
 * cache in renderBlog() or the onSuccess callbacks will throw.
 *
 * Mock setup:
 * - getById: resolves the test blog for useQuery
 * - update/remove: intercepted to verify calls without HTTP
 * - storage.loadUser: returns the logged-in user for UserContext
 *
 * Test coverage:
 * - Renders title, author, url, and likes after query resolves
 * - Like button calls update service with incremented like count
 * - Clicking like twice calls update exactly twice
 * - Remove button visible only to the blog owner
 * - Remove button calls remove service after confirm
 */

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "../contexts/NotificationContext";
import { UserContextProvider } from "../contexts/UserContext";
import { getById, update, remove } from "../services/blogs";
import storage from "../services/storage";

import Blog from "./Blog";

vi.mock("../services/blogs", () => ({
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

vi.mock("../services/storage");

const blog = {
  id: "123",
  title: "Testing Blog Detail",
  author: "Test Author",
  url: "http://test.com",
  likes: 5,
  user: {
    username: "testuser",
    id: "user123",
  },
  comments: [],
};

/**
 * Renders <Blog /> at /blogs/123 inside all required providers.
 *
 * @param {string} username - The currently logged-in user. Defaults to
 *   the blog owner so remove-button visibility tests can pass easily.
 * @param {object} blogData - The blog object to mock. Defaults to the
 *   global `blog` constant. Pass a custom object to test different states.
 */
const renderBlog = (username = "testuser", blogData = blog) => {
  storage.loadUser.mockReturnValue({ username });
  getById.mockResolvedValue(blogData); // Use the passed blog data

  // retry:false prevents React Query from retrying failed queries,
  // which would slow down tests and produce noisy console errors.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  // Pre-seed with the actual blog being rendered (not always the global `blog`)
  queryClient.setQueryData(["blogs"], [blogData]);

  render(
    // initialEntries puts the router at the blog detail URL
    <MemoryRouter initialEntries={["/blogs/123"]}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <NotificationContextProvider>
            <Routes>
              <Route path="/blogs/:id" element={<Blog />} />
              {/* catch-all so navigate("/") after delete doesn't throw */}
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </NotificationContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("Blog Detail Page", () => {
  test("renders title, author, url, and likes once data loads", async () => {
    renderBlog();

    // useQuery is async — wait for the loading state to clear
    await waitFor(() => screen.getByText("Testing Blog Detail"));

    expect(screen.getByText("Author: Test Author")).toBeDefined();
    expect(screen.getByText("http://test.com")).toBeDefined();
    expect(screen.getByText("5 Likes", { exact: false })).toBeDefined();
  });

  test("clicking like calls update with incremented like count", async () => {
    update.mockResolvedValue({ ...blog, likes: 6 });
    renderBlog();
    const userEvt = userEvent.setup();

    await waitFor(() => screen.getByRole("button", { name: /like/i }));
    await userEvt.click(screen.getByRole("button", { name: /like/i }));

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith("123", { ...blog, likes: 6 });
  });

  test("clicking like twice calls update exactly twice", async () => {
    update.mockResolvedValue({ ...blog, likes: 6 });
    renderBlog();
    const userEvt = userEvent.setup();

    await waitFor(() => screen.getByRole("button", { name: /like/i }));
    const likeButton = screen.getByRole("button", { name: /like/i });
    await userEvt.click(likeButton);
    await userEvt.click(likeButton);

    expect(update).toHaveBeenCalledTimes(2);
  });

  test("remove button is visible to the blog owner", async () => {
    renderBlog("testuser");

    await waitFor(() => screen.getByRole("button", { name: /remove/i }));
    expect(screen.getByRole("button", { name: /remove/i })).toBeDefined();
  });

  test("remove button is NOT visible to a different user", async () => {
    renderBlog("otheruser");

    // Wait for the page to finish loading before asserting absence
    await waitFor(() => screen.getByText("Testing Blog Detail"));
    expect(screen.queryByRole("button", { name: /remove/i })).toBeNull();
  });

  test("clicking remove confirms and calls remove service with blog id", async () => {
    remove.mockResolvedValue({});
    window.confirm = vi.fn(() => true);

    renderBlog("testuser");
    const userEvt = userEvent.setup();

    await waitFor(() => screen.getByRole("button", { name: /remove/i }));
    await userEvt.click(screen.getByRole("button", { name: /remove/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith("123");
  });

  test("renders comments when blog has comments", async () => {
    const blogWithComments = {
      ...blog,
      comments: ["Great post!", "Very informative.", "Thanks for sharing!"],
    };
    renderBlog("testuser", blogWithComments); // Pass custom blog as second arg

    await waitFor(() => screen.getByText("Testing Blog Detail"));

    expect(screen.getByText("Great post!")).toBeDefined();
    expect(screen.getByText("Very informative.")).toBeDefined();
    expect(screen.getByText("Thanks for sharing!")).toBeDefined();
  });

  test("shows 'No comments yet.' when comments array is empty", async () => {
    const blogWithoutComments = { ...blog, comments: [] };
    getById.mockResolvedValue(blogWithoutComments);
    renderBlog("testuser", blogWithoutComments); // Pass custom blog as second arg

    await waitFor(() => screen.getByText("Testing Blog Detail"));

    expect(screen.getByText("No comments yet.")).toBeDefined();
  });
});
