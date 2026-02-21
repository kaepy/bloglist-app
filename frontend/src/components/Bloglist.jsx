/**
 * @component Bloglist
 * Renders a sorted list of all blogs from React Query cache.
 * Blogs are sorted in descending order by likes (most liked first).
 *
 * The spread operator `[...blogs]` creates a shallow copy before sorting
 * because Array.sort() mutates in place, and React Query's cached data should not be mutated directly.
 */

import Blog from "./Blog";

import { useQuery } from "@tanstack/react-query";
import { getAll } from "../services/blogs";

const Bloglist = () => {
  const blogs = useQuery({ queryKey: ["blogs"], queryFn: getAll });

  if (blogs.isLoading) {
    return <div>loading blogs...</div>;
  }

  return (
    <div>
      {[...blogs.data]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default Bloglist;
