import React, { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ user, blog, updateBlog, removeBlog }) => {
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  //console.log(showBlogDetail)

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

  const updateLikes = (event) => {
    event.preventDefault();
    //console.log('button clicked', event.target)

    const newLikes = blog.likes + 1;

    //console.log('Blog-blog: ', blog)

    updateBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: newLikes,
      user: blog.user.id,
    });
  };

  const deleteBlog = (event) => {
    event.preventDefault();
    //console.log('button clicked', event.target)

    removeBlog({
      id: blog.id,
      title: blog.title,
    });
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
          <li>user: {blog.user.username}</li>
          {user.username === blog.user.username && (
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
    }).isRequired,
  }).isRequired,
  buttonToggle: PropTypes.func.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

export default Blog;
