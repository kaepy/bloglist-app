/**
 * @file User.test.jsx
 * Tests for the User component (single-user detail view).
 *
 * User reads :id from URL params via useParams, then fetches user data
 * with useQuery + getUserById. Tests must provide both a Router with a
 * matching route and a QueryClientProvider.
 *
 * getUserById is mocked to prevent real HTTP calls. For render tests
 * the query cache is pre-seeded so the component renders synchronously.
 *
 * Test coverage:
 * - Shows loading indicator while data is being fetched
 * - Shows error message when query fails
 * - Renders username heading once data is loaded
 * - Renders a list of the user's blogs
 */

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as usersService from "../services/users";
import User from "./User";

vi.mock("../services/users", () => ({
  getAllUsers: vi.fn(),
  getUserById: vi.fn(),
}));

/** Sample user with two blogs */
const user = {
  id: "user1",
  username: "testuser",
  blogs: [
    { id: "b1", title: "First Blog" },
    { id: "b2", title: "Second Blog" },
  ],
};

/**
 * Renders User inside MemoryRouter + QueryClientProvider.
 *
 * MemoryRouter is initialized to /users/user1 and a <Route path="/users/:id">
 * wraps the component so useParams can extract the id.
 */
const renderUser = (queryClient) => {
  render(
    <MemoryRouter initialEntries={["/users/user1"]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/users/:id" element={<User />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("User", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("when data is loading, it should show a loading indicator", () => {
    // Keep the query pending forever so the component stays in loading state
    usersService.getUserById.mockReturnValue(new Promise(() => {}));

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderUser(queryClient);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("when the query fails, it should show an error message", async () => {
    usersService.getUserById.mockRejectedValue(new Error("Network error"));

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderUser(queryClient);

    // Wait for the error state to appear after the rejected promise settles
    await waitFor(() => {
      expect(screen.getByText("User not found.")).toBeInTheDocument();
    });
  });

  test("when data is loaded, it should render the username heading", () => {
    usersService.getUserById.mockResolvedValue(user);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["user", "user1"], user);

    renderUser(queryClient);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    // The heading now says "Blogs added by testuser"
    expect(screen.getByText(/Blogs added by/i)).toBeInTheDocument();
  });

  test("when data is loaded, it should render all of the user's blogs", () => {
    usersService.getUserById.mockResolvedValue(user);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["user", "user1"], user);

    renderUser(queryClient);

    expect(screen.getByText("First Blog")).toBeInTheDocument();
    expect(screen.getByText("Second Blog")).toBeInTheDocument();

    // Verify blogs render as list items
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });
});
