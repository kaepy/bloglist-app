/**
 * @component App
 * Root component — renders either the login view (unauthenticated) or the
 * main app view (authenticated) based on user context.
 *
 * blogFormRef is passed into both Togglable and BlogForm so BlogForm can
 * collapse the form after a successful submission from inside the child.
 */

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { useRef } from "react";
import { useUser } from "./hooks/useUser";
import { useAuth } from "./hooks/useAuth";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import UserList from "./components/UserList";
import User from "./components/User";
import Blog from "./components/Blog";

import { Container, AppBar, Toolbar, IconButton, Button, Typography } from "@mui/material";

import Book from "@mui/icons-material/Book";

const App = () => {
  const { user } = useUser();
  const { handleLogin, handleLogout } = useAuth();
  const blogFormRef = useRef(); // Ref for the blog form to control its visibility

  // Unauthenticated view: show only the login form
  if (!user) {
    return (
      <Container>
        <Typography variant="h4" component="h2">
          Login to Bloglist
        </Typography>
        <Notification />
        <LoginForm handleLogin={handleLogin} />
      </Container>
    );
  }

  return (
    <Router>
      <Container>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to="/">
              <Book />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Bloglist App
              </Typography>
            </IconButton>
            <Button color="inherit" component={Link} to="/users">
              Users
            </Button>
            <Typography>{user.name} logged in</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Notification />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Togglable buttonLabel="New blog" ref={blogFormRef}>
                  <BlogForm togglableRef={blogFormRef} />
                </Togglable>
                <BlogList />
              </>
            }
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
