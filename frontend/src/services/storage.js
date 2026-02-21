/**
 * @module services/storage
 * Abstraction layer over browser localStorage for user session persistence.
 *
 * Stores the user object (including JWT token) under a fixed key.
 * All other modules should use this service instead of accessing
 * localStorage directly, making it easy to swap the storage backend
 * (e.g., sessionStorage, cookies) in the future.
 */

const KEY = "blogUserKey";

/** Persist the user object (with token) to localStorage */
const saveUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

/** Load and parse the stored user object, or return null if absent */
const loadUser = () => {
  const user = localStorage.getItem(KEY);
  return user ? JSON.parse(user) : null;
};

/** Get the username of the currently stored user, or null */
const getUsername = () => {
  const user = loadUser();
  return user ? user.username : null;
};

/** Remove the user from localStorage (effectively logging out) */
const removeUser = () => {
  localStorage.removeItem(KEY);
};

export default { saveUser, loadUser, getUsername, removeUser };
