/**
 * @component App
 * Root component — renders either the login view (unauthenticated) or the
 * main app view (authenticated) based on user context.
 *
 * blogFormRef is passed into both Togglable and BlogForm so BlogForm can
 * collapse the form after a successful submission from inside the child.
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useRef } from "react";
import { useUser } from "./hooks/useUser";
import { useAuth } from "./hooks/useAuth";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import UserList from "./components/UserList";

const App = () => {
  const { user } = useUser();
  const { handleLogin, handleLogout } = useAuth();
  const blogFormRef = useRef(); // Ref for the blog form to control its visibility

  // Unauthenticated view: show only the login form
  if (!user) {
    return (
      <div>
        <h2>Blogs</h2>
        <Notification />
        <LoginForm handleLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Router>
      <div>
        <h2>Blogs</h2>
        <Notification />
        <div>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <BlogList />
                <Togglable buttonLabel="New blog" ref={blogFormRef}>
                  <BlogForm togglableRef={blogFormRef} />
                </Togglable>
              </>
            }
          />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
