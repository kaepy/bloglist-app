/**
 * @module reducers/blogReducer
 * Redux Toolkit slice for managing blog state.
 *
 * State shape: Blog[] (array of blog objects)
 *
 * Provides four synchronous reducers (setBlogs, createBlog, updateBlog,
 * deleteBlog) and four async thunks that call the blog service and
 * dispatch success actions + notifications.
 *
 * Each thunk follows the pattern:
 *   1. Call the blog service (HTTP request)
 *   2. Dispatch the corresponding reducer action on success
 *   3. Dispatch a success notification
 *   4. On error: dispatch an error notification and re-throw
 *
 * REFACTORING NOTES:
 * - Consider using createAsyncThunk from Redux Toolkit instead of
 *   hand-written thunks. This gives you automatic pending/fulfilled/rejected
 *   action types, simplifies loading state tracking, and reduces boilerplate.
 * - Error messages use optional chaining (error.response?.data?.error)
 *   which is good, but a shared extractErrorMessage() utility would
 *   reduce duplication across all thunks.
 * - The notification dispatch inside each thunk tightly couples blog state
 *   management with UI feedback. Consider handling notifications in
 *   middleware or in the component layer instead.
 */

import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { showNotification } from "./notificationReducer";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    /** Replace the entire blogs array (used after initial fetch) */
    setBlogs(state, action) {
      return action.payload;
    },
    /** Append a newly created blog to the array */
    createBlog(state, action) {
      state.push(action.payload);
    },
    /** Replace a blog in the array with its updated version (by ID match) */
    updateBlog(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog,
      );
    },
    /** Remove a blog from the array by ID */
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

const { setBlogs, createBlog, updateBlog, deleteBlog } = blogsSlice.actions;

/** Thunk: Fetch all blogs from the server and populate the store */
export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (error) {
      dispatch(
        showNotification(
          `Error loading blogs: ${error.response?.data?.error || error.message}`,
          5,
          "error",
        ),
      );
    }
  };
};

/** Thunk: Create a new blog via the API and add it to the store */
export const appendBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content);
      dispatch(createBlog(newBlog));
      dispatch(
        showNotification(
          `A new blog "${newBlog.title}" by ${newBlog.author} added`,
          5,
        ),
      );
      return newBlog;
    } catch (error) {
      dispatch(
        showNotification(
          `Error creating blog: ${error.response?.data?.error || error.message}`,
          5,
          "error",
        ),
      );
      throw error;
    }
  };
};

/** Thunk: Increment likes on a blog via the API and update the store */
export const voteBlog = (blogObject) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, blogObject);
      dispatch(updateBlog(updatedBlog));
      dispatch(showNotification(`You liked '${updatedBlog.title}'`, 5));
    } catch (error) {
      dispatch(
        showNotification(
          `Error: ${error.response?.data?.error || error.message}`,
          5,
          "error",
        ),
      );
      throw error;
    }
  };
};

/** Thunk: Delete a blog via the API and remove it from the store */
export const destroyBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id);
      dispatch(deleteBlog(id));
      dispatch(showNotification("Blog removed successfully", 5));
    } catch (error) {
      dispatch(
        showNotification(
          `Error: ${error.response?.data?.error || error.message}`,
          5,
          "error",
        ),
      );
      throw error;
    }
  };
};

export default blogsSlice.reducer;
