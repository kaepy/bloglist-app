/**
 * @module services/login
 * HTTP service for user authentication.
 * Sends credentials to POST /api/login and returns the server response
 * containing { token, username, name }.
 *
 * The caller (userReducer) is responsible for persisting the returned
 * user object to localStorage and dispatching it to the Redux store.
 */

import axios from "axios";

/** Authenticate a user with { username, password } credentials */
const login = async (credentials) => {
  const response = await axios.post("/api/login", credentials);
  return response.data;
};

export default { login };
