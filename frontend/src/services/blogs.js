import axios from "axios";
import storage from "./storage";

const baseUrl = "/api/blogs";

// Service for handling blog-related operations

const getToken = () => ({
  headers: { Authorization: `Bearer ${storage.loadUser()?.token}` },
});

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getToken());
  return response.data;
};

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject, getToken());
  return request.then((response) => response.data);
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getToken());
  return response.data;
};

export default { getAll, create, update, remove };
