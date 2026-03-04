/**
 * @component BlogForm
 * Controlled form for creating new blog entries.
 *
 * Uses uncontrolled inputs (reads values via event.target.elements
 * instead of React state), which is simpler but makes validation harder.
 *
 * Props:
 * - togglableRef: Ref to the parent Togglable component, used to
 *   collapse the form after successful submission.
 */

import PropTypes from "prop-types";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog } from "../services/blogs";

import { useNotification } from "../hooks/useNotification";
import { TextField, Button, Typography, Stack, Paper } from "@mui/material";

const BlogForm = ({ togglableRef }) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  // Ref to the <form> element so onSuccess can reset fields after the async mutation
  // resolves — event.target is unavailable at that point
  const formRef = useRef();

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));

      // Clear and collapse only on success — preserve user input if the request fails
      formRef.current.reset();
      togglableRef?.current?.toggleVisibility();

      showNotification(`A new blog "${newBlog.title}" by ${newBlog.author} added!`, 5, "success");
    },
    onError: (error) => {
      showNotification(`Error creating blog: ${error.response?.data?.error || error.message}`, 5, "error");
    },
  });

  /** Handle form submission: create blog, clear inputs, toggle form visibility */
  const addBlog = (event) => {
    event.preventDefault();

    const content = {
      title: event.target.elements.title.value,
      author: event.target.elements.author.value,
      url: event.target.elements.url.value,
    };

    newBlogMutation.mutate(content);
  };

  return (
    <Paper sx={{ p: 2, mt: 1, maxWidth: 450 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create new blog
      </Typography>
      <Stack spacing={2} component="form" onSubmit={addBlog} ref={formRef}>
        <TextField label="Title" name="title" id="title" placeholder="placeholder title" />
        <TextField label="Author" name="author" id="author" placeholder="placeholder author" />
        <TextField label="URL" name="url" id="url" placeholder="placeholder url" />
        <Button id="create-button" type="submit" variant="contained" color="primary">
          Create
        </Button>
      </Stack>
    </Paper>
  );
};

BlogForm.propTypes = {
  togglableRef: PropTypes.shape({
    current: PropTypes.shape({
      toggleVisibility: PropTypes.func,
    }),
  }),
};

export default BlogForm;
