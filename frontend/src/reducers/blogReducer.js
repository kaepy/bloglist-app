import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { showNotification } from "./notificationReducer";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    createBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog,
      );
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

const { setBlogs, createBlog, updateBlog, deleteBlog } = blogsSlice.actions;

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
