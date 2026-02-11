import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

describe("Blog Component", () => {
  const blog = {
    id: "12345",
    title: "This is Blog title",
    author: "Blog Author",
    url: "Blog url",
    likes: 10,
    user: {
      id: "user123",
      username: "Testi Testinen",
    },
  };

  test("renders title", () => {
    const userX = { username: "testi" };
    const component = render(
      <Blog
        blog={blog}
        user={userX}
        updateBlog={vi.fn()}
        removeBlog={vi.fn()}
      />,
    );
    expect(component.container).toHaveTextContent(blog.title);

    //screen.debug()
  });

  test("renders content when view button is pressed", async () => {
    const userX = {
      username: "testi",
    };

    const component = render(
      <Blog
        blog={blog}
        user={userX}
        updateBlog={vi.fn()}
        removeBlog={vi.fn()}
      />,
    );

    //screen.debug()

    const user = userEvent.setup();

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    //screen.debug()

    expect(component.container).toHaveTextContent(blog.url);
    expect(component.container).toHaveTextContent(blog.likes);
    expect(component.container).toHaveTextContent(blog.user.username);

    //screen.debug()
  });

  test("renders likes when like button is double clicked", async () => {
    const likesHandler = vi.fn();

    const userX = {
      username: "testi",
    };

    const component = render(
      <Blog
        blog={blog}
        updateBlog={likesHandler}
        removeBlog={vi.fn()}
        user={userX}
      />,
    );

    //screen.debug()

    const user = userEvent.setup();

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    //screen.debug()

    expect(component.container).toHaveTextContent(blog.likes);

    const likeButton = screen.getByText("like");
    await user.dblClick(likeButton);

    //screen.debug()

    //expect(likesHandler.mock.calls).toHaveLength(2)
    expect(likesHandler).toHaveBeenCalledTimes(2);
  });

  test("calls removeBlog when remove button is clicked", async () => {
    const removeBlogHandler = vi.fn();
    const updateBlogHandler = vi.fn();

    const userX = {
      username: "Testi Testinen", // Same as blog.user.username to show remove button
    };

    render(
      <Blog
        blog={blog}
        updateBlog={updateBlogHandler}
        removeBlog={removeBlogHandler}
        user={userX}
      />,
    );

    const user = userEvent.setup();

    // First click view to show the details including remove button
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    // Now click remove button
    const removeButton = screen.getByText("remove");
    await user.click(removeButton);

    expect(removeBlogHandler).toHaveBeenCalledTimes(1);
    expect(removeBlogHandler).toHaveBeenCalledWith({
      id: blog.id,
      title: blog.title,
    });
  });
});
