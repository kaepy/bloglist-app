/**
 * @file BlogListItem.test.js
 * Tests for BlogListItem — a simple presentational component that renders
 * a blog title as a router link. No state, mutations, or providers needed.
 *
 * Full detail-page tests (like, remove, ownership) live in Blog.test.jsx.
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import BlogListItem from "./BlogListItem";

const blog = {
  id: "123",
  title: "Testing Blog Component",
  author: "Test Author",
  url: "http://test.com",
  likes: 5,
  user: { username: "testuser", id: "user123" },
};

describe("BlogListItem", () => {
  test("renders the blog title as a link to the detail page", () => {
    render(
      <MemoryRouter>
        <BlogListItem blog={blog} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: "Testing Blog Component" });
    expect(link).toBeDefined();
    // Verifies the href points to the correct detail route
    expect(link.getAttribute("href")).toBe("/blogs/123");
  });
});
