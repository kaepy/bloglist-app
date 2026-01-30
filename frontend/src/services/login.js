import axios from "axios";

// Uloskirjautuminen userilta:
// window.localStorage.removeItem('loggedNoteappUser')

// Local storagen tilan nollaus kokonaan:
// window.localStorage.clear()

const login = async (credentials) => {
  const response = await axios.post("/api/login", credentials);
  return response.data;
};

export default { login };
