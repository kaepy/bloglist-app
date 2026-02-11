/**
 * @module services/blogs
 * HTTP service layer for blog CRUD operations.
 * Communicates with the backend REST API at /api/blogs.
 *
 * All mutating operations (create, update, remove) include a JWT
 * Bearer token from localStorage for authentication.
 *
 * REFACTORING NOTES:
 * - getAll() uses .then() chaining while create/remove use async/await.
 *   Pick one style for consistency (prefer async/await).
 * - update() also mixes .then() with the rest using async/await.
 * - getToken() returns `Bearer undefined` when no user is logged in,
 *   which will cause 401 errors. Consider returning null and letting
 *   the caller handle unauthenticated state explicitly.
 * - The baseUrl could be pulled from an environment variable for
 *   flexibility across deployment environments.
 */

import axios from "axios";
import storage from "./storage";

const baseUrl = "/api/blogs";

/** Build the Authorization header object using the stored JWT */
const getToken = () => ({
  headers: { Authorization: `Bearer ${storage.loadUser()?.token}` },
});

/** Fetch all blogs (public, no auth required) */
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

/** Create a new blog (requires authentication) */
const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getToken());
  return response.data;
};

/** Update an existing blog by ID (requires authentication) */
const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject, getToken());
  return request.then((response) => response.data);
};

/** Delete a blog by ID (requires authentication, owner only) */
const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getToken());
  return response.data;
};

export default { getAll, create, update, remove };
