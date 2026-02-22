/**
 * @module services/blogs
 * HTTP service layer for blog CRUD operations.
 * Communicates with the backend REST API at /api/blogs.
 *
 * All mutating operations (create, update, remove) include a JWT
 * Bearer token from localStorage for authentication.
 * The getAll operation is public and does not require authentication.
 *
 * Authentication is handled via getAuthHeaders(), which returns an empty
 * object when no user is logged in, causing 401 errors on protected endpoints.
 *
 * Uses a centralized request() helper with async/await for all API calls,
 * providing consistent error handling and response parsing.
 */

import storage from "./storage";

const baseUrl = "/api/blogs";

const getAuthHeaders = () => {
  const token = storage.loadUser()?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Centralized fetch wrapper with error handling.
 * - Parses error body with fallback for non-JSON responses (e.g., HTML error pages)
 * - Returns null for 204 No Content to avoid JSON parse error on empty body
 */
const request = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
};

export const getAll = () => request(baseUrl);

export const create = (newObject) =>
  request(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(newObject),
  });

export const update = (id, newObject) =>
  request(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(newObject),
  });

export const remove = (id) =>
  request(`${baseUrl}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
