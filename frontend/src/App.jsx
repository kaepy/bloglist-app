import { useState, useEffect, useRef } from "react";

import { useDispatch } from "react-redux";
import { showNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";

import loginService from "./services/login";
import storage from "./services/storage";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Bloglist from "./components/Bloglist";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [user, setUser] = useState(null);

  const dispatch = useDispatch(); // Get the dispatch function from Redux

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
      dispatch(
        showNotification(
          error.response?.data?.error ||
            "Oops! Wrong credentials. Try again :)",
          5,
          "error",
        ),
      );
    }
  };

  // Logout function to clear user session and show a goodbye message
  const handleLogout = () => {
    setUser(null);
    storage.removeUser();
    dispatch(showNotification(`See you again ${user.name}!`, 5));
  };

  // If no user is logged in, show the login form and notifications
  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <LoginForm handleLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <Bloglist user={user} />

      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm togglableRef={blogFormRef} />
      </Togglable>
    </div>
  );
};

export default App;
