/**
 * @component LoginForm
 * Controlled form for user authentication.
 * Manages username and password state locally, then delegates the
 * actual login action to the parent via the handleLogin callback.
 *
 * Clears both fields after submission regardless of success/failure.
 *
 * REFACTORING NOTES:
 * - The form clears on submit even if login fails, which loses the
 *   user's typed username. Consider clearing only on success.
 * - Add HTML5 `required` attributes for basic browser-level validation.
 * - The `name` attributes ("Username", "Password") use Title Case which
 *   is unconventional. Standard practice is lowercase ("username", "password").
 */

import PropTypes from "prop-types";
import { useState } from "react";

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
    <div>
      <form onSubmit={handleAuth}>
        <div>
          Username:
          <input
            type="text"
            id="username"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            id="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          Login
        </button>
      </form>
      <br />
    </div>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
