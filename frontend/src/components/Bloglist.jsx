/**
 * @component Bloglist
 * Renders a sorted list of all blogs from the Redux store.
 * Blogs are sorted in descending order by likes (most liked first).
 *
 * The spread operator `[...blogs]` creates a shallow copy before sorting
 * because Array.sort() mutates in place, and Redux state must remain immutable.
 *
 * REFACTORING NOTE: Consider using React.useMemo to memoize the sorted array
 * and avoid re-sorting on every render when unrelated state changes occur.
 */

import Blog from "./Blog";
import { useSelector } from "react-redux";

const Bloglist = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default Bloglist;
