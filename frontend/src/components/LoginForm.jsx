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
import { TextField, Button, Stack } from "@mui/material";

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
    <Stack component="form" spacing={2} onSubmit={handleAuth}>
      <TextField
        label="Username"
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <TextField
        label="Password"
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <Button id="login-button" type="submit" variant="contained" color="secondary" fullWidth>
        Login
      </Button>
    </Stack>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
