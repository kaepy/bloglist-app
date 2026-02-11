import { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";

import blogService from "./services/blogs";
import loginService from "./services/login";
import storage from "./services/storage";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Error from "./components/Error";
import Bloglist from "./components/Bloglist";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const dispatch = useDispatch(); // Get the dispatch function from Redux

  const notificationMessage = useSelector((state) => state.notification); // Get the notification message from Redux state

  // Initialize blogs when the component mounts
  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  // Check for logged-in user in local storage on component mount
  useEffect(() => {
    const user = storage.loadUser();
    if (user) {
      setUser(user);
    }
  }, []);

  // Ref for the blog form to toggle its visibility after creating a new blog
  const blogFormRef = useRef();

  // Login function to authenticate user and show a welcome message
  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      setUser(user);
      storage.saveUser(user);
      dispatch(showNotification(`Welcome ${user.username}!`, 5));
    } catch (error) {
      handleErrorChange("Oops! Wrong credentials. Try again :)", error);
    }
  };

  // Logout function to clear user session and show a goodbye message
  const handleLogout = () => {
    setUser(null);
    storage.removeUser();
    dispatch(showNotification(`See you again ${user.name}!`, 5));
  };

  // REFACTOR
  const handleCreate = async (blog) => {
    const newBlog = await blogService.create(blog);
    setBlogs(blogs.concat(newBlog));
    notify(`Blog created: ${newBlog.title}, ${newBlog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  // REFACTOR
  const updateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.update(blogObject.id, blogObject);
      setBlogs(
        blogs.map((blog) => (blog.id !== blogObject.id ? blog : returnedBlog)),
      );

      dispatch(
        showNotification(`New like added to blog ${blogObject.title}`, 5),
      );
    } catch (error) {
      handleErrorChange(
        error.response?.data?.error ||
          "Failed to update blog. Please try again.",
      );
    }
  };

  // REFACTOR
  const removeBlog = async (blogObject) => {
    if (
      window.confirm(`Are you sure you want to remove ${blogObject.title} ?`)
    ) {
      try {
        await blogService.remove(blogObject.id);
        setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));

        dispatch(showNotification(`Blog ${blogObject.title} removed`, 5));
      } catch (error) {
        handleErrorChange(
          error.response?.data?.error ||
            "Failed to remove blog. Please try again.",
        );
      }
    }
  };

  // REFACTOR
  const handleErrorChange = (error) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  // If no user is logged in, show the login form and notifications
  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={notificationMessage} />
        <Error message={errorMessage} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <Bloglist user={user} updateBlog={updateBlog} removeBlog={removeBlog} />

      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} />
      </Togglable>
    </div>
  );
};

export default App;
