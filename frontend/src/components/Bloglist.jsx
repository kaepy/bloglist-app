import Blog from "./Blog";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Bloglist = ({ user }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} user={user} blog={blog} />
        ))}
    </div>
  );
};

Bloglist.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Bloglist;
