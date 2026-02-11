import axios from "axios";

// Service for handling user login
const login = async (credentials) => {
  const response = await axios.post("/api/login", credentials);
  return response.data;
};

export default { login };
