/**
 * @component AuthenticatedApp
 * Main app view for authenticated users — navigation bar, routes, and content.
 *
 * Separated from App so that useLocation (which requires Router context) can be
 * called at the top level, and App.jsx stays a simple auth/unauth switch.
 */

import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useRef } from "react";
import PropTypes from "prop-types";

import BlogList from "./BlogList";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import UserList from "./UserList";
import User from "./User";
import Blog from "./Blog";

import { Container, AppBar, Toolbar, IconButton, Button, Typography, Box } from "@mui/material";

const AuthenticatedApp = ({ user, handleLogout }) => {
  const location = useLocation();
  const blogFormRef = useRef(); // Ref for the blog form to control its visibility

  /** Check if the given path matches the current route */
  const isActive = (path) => location.pathname === path;

  /**
   * Shared sx styles for nav links — handles active underline + hover effect.
   * The underline is a ::after pseudo-element that animates its width.
   */
  const navLinkSx = (path) => ({
    color: "inherit",
    position: "relative",
    // Keltainen alleviivaus ::after-pseudo-elementillä
    "&::after": {
      content: "''",
      position: "absolute",
      bottom: 6,
      left: "50%",
      transform: "translateX(-50%)",
      width: isActive(path) ? "60%" : "0%",
      height: "2px",
      backgroundColor: "secondary.main",
      transition: "width 0.3s ease",
    },
    "&:hover::after": {
      width: "60%",
    },
    "&:hover": {
      backgroundColor: "rgba(255, 214, 0, 0.08)",
    },
    transition: "background-color 0.2s ease",
  });

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          {/* Logo — linkki etusivulle */}
          <IconButton edge="start" color="inherit" aria-label="menu" component={Link} to="/" sx={{ mr: -0.8 }}>
            <img src="/favicon.svg" alt="Bloglist" width={36} height={36} />
          </IconButton>
          <Typography variant="h6" component={Link} to="/" sx={{ color: "secondary.main", textDecoration: "none" }}>
            loglist App
          </Typography>

          {/* Nav-linkit */}
          <Button component={Link} to="/" sx={navLinkSx("/")}>
            Blogs
          </Button>
          <Button component={Link} to="/users" sx={navLinkSx("/users")}>
            Users
          </Button>

          {/* Spacer — työntää loppuosan oikeaan reunaan */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Käyttäjäinfo + logout */}
          <Typography
            variant="body2"
            component="span"
            sx={{
              backgroundColor: "secondary.main",
              color: "secondary.contrastText",
              px: 1,
              borderRadius: 1,
              mr: 1,
            }}
          >
            {user.name} logged in
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.12)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

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
  );
};

AuthenticatedApp.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default AuthenticatedApp;
