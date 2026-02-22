/**
 * Service module for user-related API calls.
 * Provides a getAllUsers function to fetch all users from the backend.
 *
 * Uses a centralized request() helper with async/await for consistent error handling
 * and response parsing. The getAllUsers function is public and does not require authentication.
 */

const baseUrl = "/api/users";

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

export const getAllUsers = () => request(baseUrl);

export const getUserById = (id) => request(`${baseUrl}/${id}`);
