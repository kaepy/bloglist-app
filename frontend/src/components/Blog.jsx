/**
 * @component Blog
 * Detail page for a single blog post. Reads :id from the URL, fetches the blog
 * with useQuery, and renders title, author, URL, likes, and the creator's username.
 *
 * Like button increments likes and syncs both the detail cache ["blog", id] and the
 * list cache ["blogs"] so sort order is correct when navigating back to the list.
 *
 * Remove button is only rendered when the logged-in user is the blog's creator.
 * On successful delete, navigates to "/" and removes the entry from the list cache
 * via setQueryData — no extra network request needed.
 */
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getBlogById, updateBlog, commentBlog, removeBlog } from "../services/blogs";

import { useNotification } from "../hooks/useNotification";
import { useUser } from "../hooks/useUser";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";

const Blog = () => {
  const { id } = useParams();
  const { data: blog, isLoading, isError } = useQuery({ queryKey: ["blog", id], queryFn: () => getBlogById(id) });

  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showNotification } = useNotification();

  const voteBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => updateBlog(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      // Keep the list cache in sync (so sort order is correct when navigating back)
      const blogs = queryClient.getQueryData(["blogs"]);
      if (blogs) {
        queryClient.setQueryData(
          ["blogs"],
          blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)),
        );
      }
      // Update the detail page cache (so the count updates immediately)
      queryClient.setQueryData(["blog", id], updatedBlog);
      showNotification(`New like added to blog "${updatedBlog.title}"!`, 5, "success");
    },
    onError: (error) => {
      showNotification(`Error updating blog: ${error.response?.data?.error || error.message}`, 5, "error");
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => removeBlog(id),
    onSuccess: (_, blogId) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      if (blogs) {
        queryClient.setQueryData(
          ["blogs"],
          blogs.filter((b) => b.id !== blogId),
        );
      }
      navigate("/");
      showNotification(`Blog "${blog.title}" removed!`, 5, "success");
    },
    onError: (error) => {
      showNotification(`Error deleting blog: ${error.response?.data?.error || error.message}`, 5, "error");
    },
  });

  const newCommentMutation = useMutation({
    mutationFn: (comment) => commentBlog(id, comment),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["blog", blog.id], updatedBlog);
      formRef.current.reset();
      showNotification(`Comment added to blog "${updatedBlog.title}"!`, 5, "success");
    },
    onError: (error) => {
      showNotification(`Error adding comment: ${error.response?.data?.error || error.message}`, 5, "error");
    },
  });

  const formRef = useRef();

  if (isLoading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;
  if (isError) return <Alert severity="error">Blog not found.</Alert>;

  const updateLikes = (event) => {
    event.preventDefault();
    voteBlogMutation.mutate({
      id: blog.id,
      updatedBlog: {
        ...blog,
        likes: blog.likes + 1,
      },
    });
  };

  const deleteBlog = (event) => {
    event.preventDefault();
    if (window.confirm(`Are you sure you want to remove ${blog.title}?`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };

  const addComment = (event) => {
    event.preventDefault();
    const comment = event.target.elements.comment.value;
    newCommentMutation.mutate(comment);
  };

  const isOwner = blog.user && user.username === blog.user.username;

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <MuiLink href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </MuiLink>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Added by{" "}
          <MuiLink component={Link} to={`/users/${blog.user.id}`}>
            {blog.user.username}
          </MuiLink>
        </Typography>
      </CardContent>

      <CardActions>
        <Button startIcon={<ThumbUpIcon />} onClick={updateLikes} id="like-button">
          Like ({blog.likes})
        </Button>

        {isOwner && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="error" onClick={deleteBlog} id="remove-button" aria-label="delete blog">
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </CardActions>

      <Divider />

      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <Box component="form" onSubmit={addComment} ref={formRef} sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField name="comment" id="comment" placeholder="Add a comment..." size="small" fullWidth />
          <Button type="submit" variant="contained" id="add-comment-button">
            Add
          </Button>
        </Box>
        {blog.comments?.length > 0 ? (
          <List dense>
            {blog.comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText primary={comment} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No comments yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Blog;
