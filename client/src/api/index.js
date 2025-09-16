import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI || "http://localhost:8001/api",
  timeout: 120000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getGroups = () => apiClient.get("/groups");
const createGroup = (data) => apiClient.post("/groups", data);
const getAllUsers = () => apiClient.get("/users");

export { getGroups, createGroup, getAllUsers };
