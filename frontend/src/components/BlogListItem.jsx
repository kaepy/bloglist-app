/**
 * @component BlogListItem
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

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const BlogListItem = ({ blog }) => {
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

  return (
    <div className="blog" style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
    </div>
  );
};

BlogListItem.propTypes = {
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

export default BlogListItem;
