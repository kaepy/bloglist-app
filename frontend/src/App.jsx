/**
 * @component App
 * Root application component. Handles:
 * - Initializing blogs and user session on mount (via Redux thunks)
 * - Conditional rendering of LoginForm (unauthenticated) vs. main app (authenticated)
 * - Login/logout workflows with notification feedback
 *
 * Component tree (when logged in):
 *   App
 *   ├─ Notification
 *   ├─ Bloglist (sorted list of blogs)
 *   └─ Togglable > BlogForm (create new blog)
 *
 * REFACTORING NOTES:
 * - The login error handling catches at the component level, which is fine,
 *   but the error message fallback string duplicates UI text. Consider
 *   centralizing error messages.
 * - The blogFormRef is used to programmatically close the Togglable after
 *   blog creation. This imperative pattern works but could be replaced with
 *   a controlled `isOpen` prop pattern for more predictable state flow.
 */

import { useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUser, loginUser, logoutUser } from "./reducers/userReducer";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Bloglist from "./components/Bloglist";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const blogFormRef = useRef(); // Ref for the blog form to control its visibility

  // On mount: fetch all blogs from API and restore user session from localStorage
  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUser());
  }, [dispatch]);

  // Login function to authenticate user and show a welcome message
  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials));
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

  /** Clear user session from Redux store and localStorage */
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Unauthenticated view: show only the login form
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

      <Bloglist />

      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm togglableRef={blogFormRef} />
      </Togglable>
    </div>
  );
};

export default App;
