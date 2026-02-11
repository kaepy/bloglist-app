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
 * - The empty catch block silently swallows errors. At minimum, log the
 *   error or display a user-facing message.
 */

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { appendBlog } from "../reducers/blogReducer";

const BlogForm = ({ togglableRef }) => {
  const dispatch = useDispatch();

  /** Handle form submission: create blog, clear inputs, toggle form visibility */
  const addBlog = async (event) => {
    event.preventDefault();

    // Read values from uncontrolled inputs via DOM element references
    const content = {
      title: event.target.elements.title.value,
      author: event.target.elements.author.value,
      url: event.target.elements.url.value,
    };

    try {
      await dispatch(appendBlog(content));

      // Clear form fields after successful creation
      event.target.elements.title.value = "";
      event.target.elements.author.value = "";
      event.target.elements.url.value = "";

      // Collapse the Togglable wrapper
      togglableRef?.current?.toggleVisibility();
    } catch {
      // Error notification is already dispatched by the appendBlog thunk
    }
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
