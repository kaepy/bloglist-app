import Blog from "./Blog";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Bloglist = ({ user, updateBlog, removeBlog }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      {[...blogs]
        .sort((a, b) => a.likes - b.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            user={user}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
          />
        ))}
    </div>
  );
};

Bloglist.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  blogs: PropTypes.array.isRequired,
  createBlog: PropTypes.func.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Bloglist;
