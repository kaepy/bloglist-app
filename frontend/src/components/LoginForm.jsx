/**
 * @component LoginForm
 * Controlled form for user authentication.
 * Manages username and password state locally, then delegates the
 * actual login action to the parent via the handleLogin callback.
 *
 * Clears both fields after submission regardless of success/failure.
 */

import PropTypes from "prop-types";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /** Submit credentials and clear form fields */
  const handleAuth = (event) => {
    event.preventDefault();
    handleLogin({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <Box>
      <Box
        component="form"
        onSubmit={handleAuth}
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300 }}
      >
        <TextField
          label="Username"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          size="small"
          fullWidth
        />
        <Button id="login-button" type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </Box>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
