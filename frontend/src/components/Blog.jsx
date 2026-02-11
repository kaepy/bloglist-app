import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { voteBlog, destroyBlog } from "../reducers/blogReducer";

const Blog = ({ user, blog }) => {
  const [showBlogDetail, setShowBlogDetail] = useState(false);

  const dispatch = useDispatch();

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

  // Update blog likes by dispatching the voteBlog action with the updated blog data
  const updateLikes = (event) => {
    event.preventDefault();

    dispatch(
      voteBlog({
        id: blog.id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user?.id,
      }),
    );
  };

  // Delete blog if the user confirms the action
  const deleteBlog = (event) => {
    event.preventDefault();

    if (window.confirm(`Are you sure you want to remove ${blog.title}?`)) {
      dispatch(destroyBlog(blog.id));
    }
  };

  // Toggle blog details visibility
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
          <li>user: {blog.user?.username ?? "unknown"}</li>
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
