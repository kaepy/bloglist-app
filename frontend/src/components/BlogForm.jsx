import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { appendBlog } from "../reducers/blogReducer";

const BlogForm = ({ togglableRef }) => {
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
      // Dispatch the appendBlog action to create a new blog
      await dispatch(appendBlog(content));

      // Clear form fields after successful submission
      event.target.elements.title.value = "";
      event.target.elements.author.value = "";
      event.target.elements.url.value = "";

      togglableRef?.current?.toggleVisibility(); // Toggle form visibility if ref is provided
    } catch {
      // Handle any errors that occur during blog creation
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
