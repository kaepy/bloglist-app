import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { appendBlog } from "../reducers/blogReducer";
import { showNotification } from "../reducers/notificationReducer";

const BlogForm = () => {
  const dispatch = useDispatch();

  const addBlog = async (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    // Create blog content from form inputs
    const content = {
      title: event.target.elements.title.value,
      author: event.target.elements.author.value,
      url: event.target.elements.url.value,
    };

    try {
      // Dispatch action to append the new blog
      await dispatch(appendBlog(content));

      // Clear form fields after successful submission
      event.target.elements.title.value = "";
      event.target.elements.author.value = "";
      event.target.elements.url.value = "";

      // Show notification for successful blog creation
      dispatch(
        showNotification(
          `A new blog "${content.title}" by ${content.author} added`,
          5,
        ),
      );
    } catch (error) {
      dispatch(
        showNotification(
          error.response?.data?.error || "Failed to create blog. Please log in again.",
          5,
        ),
      );
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

export default BlogForm;
