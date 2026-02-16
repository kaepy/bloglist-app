/**
 * @component BlogForm
 * Controlled form for creating new blog entries.
 *
 * Uses uncontrolled inputs (reads values via event.target.elements
 * instead of React state), which is simpler but makes validation harder.
 *
 * Props:
 * - togglableRef: Ref to the parent Togglable component, used to
 *   collapse the form after successful submission.
 *
 * REFACTORING NOTES:
 * - The form uses `id` attributes to access input values via
 *   event.target.elements. This works but is fragile — consider using
 *   controlled inputs with useState or a form library (e.g., React Hook Form)
 *   for better validation, error display, and testability.
 * - The `name` attribute on inputs is missing, which means
 *   event.target.elements relies on the `id`. Add `name` attributes
 *   for robustness and accessibility.
 */

import PropTypes from "prop-types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "../services/blogs";

import { useNotification } from "../hooks/useNotification";

const BlogForm = ({ togglableRef }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  // useMutation hook for creating a new blog entry
  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));

      showNotification(`A new blog "${newBlog.title}" by ${newBlog.author} added!`, 5, "success");
    },
    onError: (error) => {
      showNotification(`Error creating blog: ${error.response?.data?.error || error.message}`, 5, "error");
    },
  });

  /** Handle form submission: create blog, clear inputs, toggle form visibility */
  const addBlog = (event) => {
    event.preventDefault();

    const content = {
      title: event.target.elements.title.value,
      author: event.target.elements.author.value,
      url: event.target.elements.url.value,
    };

    newBlogMutation.mutate(content);

    // Clear form fields after submission
    event.target.elements.title.value = "";
    event.target.elements.author.value = "";
    event.target.elements.url.value = "";

    // Collapse the Togglable wrapper
    togglableRef?.current?.toggleVisibility();
  };

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title: <input id="title" placeholder="placeholder title" />
        </div>
        <div>
          author: <input id="author" placeholder="placeholder author" />
        </div>
        <div>
          url: <input id="url" placeholder="placeholder url" />
        </div>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
      <br />
    </div>
  );
};

BlogForm.propTypes = {
  togglableRef: PropTypes.shape({
    current: PropTypes.shape({
      toggleVisibility: PropTypes.func,
    }),
  }),
};

export default BlogForm;
