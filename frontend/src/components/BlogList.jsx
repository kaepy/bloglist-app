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
import { getAllBlogs } from "../services/blogs";
import LoadingSpinner from "./LoadingSpinner";

import { List, Paper, Alert } from "@mui/material";

const BlogList = () => {
  const blogs = useQuery({ queryKey: ["blogs"], queryFn: getAllBlogs });

  if (blogs.isLoading) return <LoadingSpinner message="Loading blogs..." />;

  if (blogs.isError) return <Alert severity="error">Error loading blogs. Please try again.</Alert>;

  return (
    <Paper sx={{ mt: 2 }}>
      <List>
        {[...blogs.data]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <BlogListItem key={blog.id} blog={blog} />
          ))}
      </List>
    </Paper>
  );
};

export default BlogList;
