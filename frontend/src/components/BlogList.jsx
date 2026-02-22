/**
 * @component BlogList
 * Renders a sorted list of all blogs from React Query cache.
 * Blogs are sorted in descending order by likes (most liked first).
 *
 * The spread operator `[...blogs]` creates a shallow copy before sorting
 * because Array.sort() mutates in place, and React Query's cached data should not be mutated directly.
 */

import BlogListItem from "./BlogListItem";

import { useQuery } from "@tanstack/react-query";
import { getAll } from "../services/blogs";

const BlogList = () => {
  const blogs = useQuery({ queryKey: ["blogs"], queryFn: getAll });

  if (blogs.isLoading) {
    return <div>loading blogs...</div>;
  }

  if (blogs.isError) {
    return <div>Error loading blogs. Please try again.</div>;
  }

  return (
    <div>
      {[...blogs.data]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogListItem key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default BlogList;
