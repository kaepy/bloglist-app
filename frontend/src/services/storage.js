const KEY = "blogUserKey"; // Key used to store user data in localStorage

// Service for managing user data in localStorage
const saveUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

// Load user data from localStorage and parse it as JSON
const loadUser = () => {
  const user = localStorage.getItem(KEY);
  return user ? JSON.parse(user) : null;
};

// Get the username of the currently logged-in user, or null if no user is logged in
const getUsername = () => {
  const user = loadUser();
  return user ? user.username : null;
};

// Remove user data from localStorage to log out the user
const removeUser = () => {
  localStorage.removeItem(KEY);
};

export default { saveUser, loadUser, getUsername, removeUser };
