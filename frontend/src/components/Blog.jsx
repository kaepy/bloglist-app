/**
 * @component Blog
 * Detail page for a single blog post. Reads :id from the URL, fetches the blog
 * with useQuery, and renders title, author, URL, likes, and the creator's username.
 *
 * Like button increments likes and syncs both the detail cache ["blog", id] and the
 * list cache ["blogs"] so sort order is correct when navigating back to the list.
 *
 * Remove button is only rendered when the logged-in user is the blog's creator.
 * On successful delete, navigates to "/" and removes the entry from the list cache
 * via setQueryData — no extra network request needed.
 */
import { useParams, Link, useNavigate } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getById, update, remove } from "../services/blogs";

import { useNotification } from "../hooks/useNotification";
import { useUser } from "../hooks/useUser";

const Blog = () => {
  const { id } = useParams();
  const { data: blog, isLoading, isError } = useQuery({ queryKey: ["blog", id], queryFn: () => getById(id) });

  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showNotification } = useNotification();

  const voteBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      // keep the list cache in sync (so sort order is correct when navigating back)
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)),
      );
      // update the detail page cache (so the count updates immediately)
      queryClient.setQueryData(["blog", id], updatedBlog);
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
      navigate("/");
      showNotification(`Blog "${blog.title}" removed!`, 5, "success");
    },
    onError: (error) => {
      showNotification(`Error deleting blog: ${error.response?.data?.error || error.message}`, 5, "error");
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Blog not found.</div>;

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

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>Author: {blog.author}</div>
      <div>
        Url: <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} Likes{" "}
        <button id="like-button" onClick={updateLikes}>
          like
        </button>
      </div>
      <div>
        Added by <Link to={`/users/${blog.user.id}`}>{blog.user.username}</Link>
      </div>
      <div>
        {blog.user && user.username === blog.user.username && (
          <button id="remove-button" onClick={deleteBlog}>
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
