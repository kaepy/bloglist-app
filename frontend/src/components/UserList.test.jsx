/**
 * @file UserList.test.jsx
 * Tests for the UserList component (table of all users with blog counts).
 *
 * UserList uses useQuery with getAllUsers and renders <Link> per user row,
 * so the test tree needs QueryClientProvider + MemoryRouter.
 *
 * getAllUsers is mocked to prevent real HTTP calls. For render tests
 * the query cache is pre-seeded so the component renders synchronously.
 *
 * Test coverage:
 * - Shows loading indicator while data is being fetched
 * - Renders all usernames once data is loaded
 * - Shows the correct blog count for each user
 * - Renders links pointing to the correct user detail routes
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as usersService from "../services/users";
import UserList from "./UserList";

vi.mock("../services/users", () => ({
  getAllUsers: vi.fn(),
  getUserById: vi.fn(),
}));

/** Sample users with varying blog counts */
const users = [
  {
    id: "u1",
    username: "alice",
    blogs: [
      { id: "b1", title: "Alice Blog 1" },
      { id: "b2", title: "Alice Blog 2" },
    ],
  },
  {
    id: "u2",
    username: "bob",
    blogs: [{ id: "b3", title: "Bob Blog 1" }],
  },
  {
    id: "u3",
    username: "charlie",
    blogs: [],
  },
];

/**
 * Renders UserList inside MemoryRouter + QueryClientProvider.
 * MemoryRouter is needed because UserList renders <Link> for each user row.
 */
const renderUserList = (queryClient) => {
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("UserList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("when data is loading, it should show a loading indicator", () => {
    usersService.getAllUsers.mockReturnValue(new Promise(() => {}));

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderUserList(queryClient);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("when data is loaded, it should render all usernames", () => {
    usersService.getAllUsers.mockResolvedValue(users);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["users"], users);

    renderUserList(queryClient);

    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(screen.getByText("bob")).toBeInTheDocument();
    expect(screen.getByText("charlie")).toBeInTheDocument();
  });

  test("when data is loaded, it should show the correct blog count per user", () => {
    usersService.getAllUsers.mockResolvedValue(users);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["users"], users);

    renderUserList(queryClient);

    // Each user row: [username cell, count cell]
    // Get all table rows (skip thead row) and verify counts
    const rows = screen.getAllByRole("row");
    // rows[0] is the header; rows[1..3] are data rows
    const dataCells = rows.slice(1).map((row) => {
      const cells = row.querySelectorAll("td");
      return { username: cells[0].textContent, count: cells[1].textContent };
    });

    expect(dataCells).toEqual([
      { username: "alice", count: "2" },
      { username: "bob", count: "1" },
      { username: "charlie", count: "0" },
    ]);
  });

  test("when data is loaded, it should render links to each user's detail page", () => {
    usersService.getAllUsers.mockResolvedValue(users);

    const queryClient = new QueryClient();
    queryClient.setQueryData(["users"], users);

    renderUserList(queryClient);

    // Each username should be a link pointing to /users/:id
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);

    expect(links[0]).toHaveAttribute("href", "/users/u1");
    expect(links[1]).toHaveAttribute("href", "/users/u2");
    expect(links[2]).toHaveAttribute("href", "/users/u3");
  });
});
