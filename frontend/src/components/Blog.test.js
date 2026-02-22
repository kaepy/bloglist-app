/**
 * @file Blog.test.js
 * Component integration tests for the Blog component.
 *
 * Each test renders the Blog component inside providers that mirror
 * the real app: QueryClientProvider, UserContextProvider, and
 * NotificationContextProvider.
 *
 * Mock setup:
 * - blogService.update and blogService.remove are mocked to prevent
 *   actual HTTP requests while verifying they're called correctly.
 * - storage.loadUser is mocked to return a test user so the
 *   UserContext has a logged-in user for ownership checks.
 *
 * Test coverage:
 * - Renders title in collapsed view
 * - Expands details on "view" button click
 * - Like button calls update service (verifies double-click = 2 calls)
 * - Remove button triggers confirm dialog and calls remove service
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "../contexts/NotificationContext";
import { UserContextProvider } from "../contexts/UserContext";
import { update, remove } from "../services/blogs";
import storage from "../services/storage";

import Blog from "./Blog";

/** Mock blog service to intercept HTTP calls */
vi.mock("../services/blogs", () => ({
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

/** Mock storage so UserContext can load the test user without real localStorage */
vi.mock("../services/storage");

/** Test data: a sample blog owned by testuser */
const blog = {
  id: "123",
  title: "Testing Blog Component",
  author: "Test Author",
  url: "http://test.com",
  likes: 5,
  user: {
    username: "testuser",
    id: "user123",
  },
};

/** The user who owns the test blog */
const user = { username: "testuser" };

/**
 * Helper: mocks storage to return the test user, then renders Blog
 * inside all required providers (same nesting as main.jsx).
 *
 * UserContextProvider reads the user via initializeUser → storage.loadUser,
 * but we need the user available immediately. So we mock storage.loadUser
 * to return our test user, and the component's useUser() will pick it up
 * once initializeUser is called in App. For tests, we trigger it by
 * rendering a small wrapper that calls initializeUser on mount.
 */
const renderBlog = () => {
  // Mock storage to return our test user
  storage.loadUser.mockReturnValue(user);

  const queryClient = new QueryClient();

  // Small wrapper that just renders Blog inside all providers.
  // The UserContextProvider automatically restores the user from storage on mount
  // (mocked above via storage.loadUser.mockReturnValue(user)).
  const BlogWithInit = () => <Blog blog={blog} />;

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <NotificationContextProvider>
            <BlogWithInit />
          </NotificationContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("Blog Component", () => {
  test("when rendered, it should display the blog title", () => {
    renderBlog();
    expect(screen.getByText("Testing Blog Component", { exact: false })).toBeDefined();
  });

  test("when view button is clicked, it should show author, url, and likes", async () => {
    renderBlog();
    const userEvt = userEvent.setup();

    const viewButton = screen.getByText("view", { exact: false });
    await userEvt.click(viewButton);

    expect(screen.getByText("author: Test Author")).toBeDefined();
    expect(screen.getByText("http://test.com", { exact: false })).toBeDefined();
    expect(screen.getByText("likes: 5", { exact: false })).toBeDefined();
  });

  test("when like button is clicked twice, it should call update service twice", async () => {
    const updatedBlog = { ...blog, likes: 6 };
    update.mockResolvedValue(updatedBlog);

    renderBlog();
    const userEvt = userEvent.setup();

    const viewButton = screen.getByText("view", { exact: false });
    await userEvt.click(viewButton);

    const likeButton = screen.getByText("like");
    await userEvt.click(likeButton);
    await userEvt.click(likeButton);

    expect(update).toHaveBeenCalledTimes(2);
  });

  test("when remove button is clicked and confirmed, it should call remove service with blog id", async () => {
    remove.mockResolvedValue({});
    window.confirm = vi.fn(() => true);

    renderBlog();
    const userEvt = userEvent.setup();

    const viewButton = screen.getByText("view", { exact: false });
    await userEvt.click(viewButton);

    const removeButton = screen.getByText("remove");
    await userEvt.click(removeButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith("123");
  });
});
