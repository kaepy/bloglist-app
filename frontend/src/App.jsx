/**
 * @component App
 * Root application component. Handles:
 * - Initializing user session on mount (via Redux thunk)
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
import { initializeUser, loginUser, logoutUser } from "./reducers/userReducer";
import { useNotification } from "./hooks/useNotification";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Bloglist from "./components/Bloglist";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const blogFormRef = useRef(); // Ref for the blog form to control its visibility
  const { showNotification } = useNotification();

  // On mount: restore user session from localStorage
  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  // Login function to authenticate user and show a welcome message
  const handleLogin = async (credentials) => {
    try {
      const user = await dispatch(loginUser(credentials));
      showNotification(`Welcome back, ${user.name}!`, 5, "success");
    } catch (error) {
      showNotification(error.response?.data?.error || "Oops! Wrong credentials. Try again :)", 5, "error");
    }
  };

  /** Clear user session from Redux store and localStorage */
  const handleLogout = () => {
    const loggedOutUser = dispatch(logoutUser());
    showNotification(`See you again ${loggedOutUser.name}!`, 5, "success");
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
