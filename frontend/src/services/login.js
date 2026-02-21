/**
 * @module services/login
 * HTTP service for user authentication.
 * Sends credentials to POST /api/login and returns the server response
 * containing { token, username, name }.
 *
 * Uses axios (not the fetch-based blogs service) because the login
 * response drives UserContext state, and axios provides consistent
 * error shape via response.data.
 */

import axios from "axios";

/** Authenticate a user with { username, password } credentials */
const login = async (credentials) => {
  const response = await axios.post("/api/login", credentials);
  return response.data;
};

export default { login };
