import axios from "axios";

const api = axios.create({
  baseURL: "https://v-code-production-8f3a.up.railway.app/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vcode-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;