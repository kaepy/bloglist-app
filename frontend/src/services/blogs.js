/**
 * @module services/blogs
 * HTTP service layer for blog CRUD operations.
 * Communicates with the backend REST API at /api/blogs.
 *
 * All mutating operations (create, update, remove) include a JWT
 * Bearer token from localStorage for authentication.
 * The getAll operation is public and does not require authentication.
 * getToken() returns `Bearer undefined` when no user is logged in, which will cause 401 errors for purpose.
 *
 * REFACTORING NOTES:
 *   Pick one style for consistency (prefer async/await).
 * - getToken() returns `Bearer undefined` when no user is logged in, which will cause 401 errors. Consider returning null and letting the caller handle unauthenticated state explicitly.
 * - The baseUrl could be pulled from an environment variable for flexibility across deployment environments.
 */

import axios from "axios";
import storage from "./storage";

const baseUrl = "/api/blogs";

/** Build the Authorization header object using the stored JWT */
const getToken = () => ({
  headers: { Authorization: `Bearer ${storage.loadUser()?.token}` },
});

/** Fetch all blogs (public, no auth required) */
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

/** Create a new blog (requires authentication) */
const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getToken());
  return response.data;
};

/** Update an existing blog by ID (requires authentication) */
const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, getToken());
  return response.data;
};

/** Delete a blog by ID (requires authentication, owner only) */
const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getToken());
  return response.data;
};

export default { getAll, create, update, remove };
