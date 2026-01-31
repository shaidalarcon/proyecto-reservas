import axios from "axios";

const APIHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: APIHeaders,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
