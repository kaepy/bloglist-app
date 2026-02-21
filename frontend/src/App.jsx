/**
 * @component App
 * Root component — renders either the login view (unauthenticated) or the
 * main app view (authenticated) based on user context.
 *
 * blogFormRef is passed into both Togglable and BlogForm so BlogForm can
 * collapse the form after a successful submission from inside the child.
 */

import { useRef } from "react";
import { useUser } from "./hooks/useUser";
import { useAuth } from "./hooks/useAuth";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Bloglist from "./components/Bloglist";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const { user } = useUser();
  const { handleLogin, handleLogout } = useAuth();
  const blogFormRef = useRef(); // Ref for the blog form to control its visibility

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
