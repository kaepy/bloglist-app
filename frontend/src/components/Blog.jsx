/**
 * @component Blog
 * Displays a single blog entry with expandable details.
 *
 * Features:
 * - Collapsed view shows only the title and a "view" toggle button
 * - Expanded view shows author, url, likes (with like button), and username
 * - The "remove" button is only visible to the blog's creator
 * - Uses React Query mutations for like and delete operations
 * - Notifications via NotificationContext on success/error
 *
 * Props:
 * - blog: Blog object { id, title, author, url, likes, user }
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { useUser } from "../hooks/useUser";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update, remove } from "../services/blogs";
import { useNotification } from "../hooks/useNotification";

const Blog = ({ blog }) => {
  const [showBlogDetail, setShowBlogDetail] = useState(false);

  const { user } = useUser();
  const queryClient = useQueryClient();

  const { showNotification } = useNotification();

  // Inline styles for blog card layout
  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    listStyleType: "none",
  };

  const ulStyle = {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  };

  const voteBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)),
      );
      showNotification(`New like added to blog "${updatedBlog.title}"!`, 5, "success");
    },
    onError: (error) => {
      showNotification(`Error updating blog: ${error.response?.data?.error || error.message}`, 5, "error");
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => remove(id),
    onSuccess: (_, blogId) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((b) => b.id !== blogId),
      );
      showNotification(`Blog "${blog.title}" removed!`, 5, "success");
    },
    onError: (error) => {
      showNotification(`Error deleting blog: ${error.response?.data?.error || error.message}`, 5, "error");
    },
  });

  const updateLikes = (event) => {
    event.preventDefault();

    voteBlogMutation.mutate({
      id: blog.id,
      updatedBlog: {
        ...blog,
        likes: blog.likes + 1,
      },
    });
  };

  const deleteBlog = (event) => {
    event.preventDefault();

    if (window.confirm(`Are you sure you want to remove ${blog.title}?`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };

  const buttonToggle = () => setShowBlogDetail(!showBlogDetail);
  const buttonLabel = showBlogDetail ? "hide" : "view";

  return (
    <div className="blog" style={blogStyle}>
      {blog.title}{" "}
      <button id="viewhide-button" onClick={buttonToggle}>
        {" "}
        {buttonLabel}{" "}
      </button>
      {showBlogDetail && (
        <ul style={ulStyle}>
          <li>author: {blog.author}</li>
          <li>url: {blog.url}</li>
          <li>
            likes: {blog.likes}{" "}
            <button id="like-button" onClick={updateLikes}>
              like
            </button>
          </li>
          <li>
            user: <Link to={`/users/${blog.user?.id}`}>{blog.user?.username ?? "unknown"}</Link>
          </li>
          {blog.user && user.username === blog.user.username && (
            <li>
              <button id="remove-button" onClick={deleteBlog}>
                remove
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default Blog;
