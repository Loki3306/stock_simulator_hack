import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;
async function refresh() {
  const res = await axios
    .post("/api/auth/refresh", {}, { withCredentials: true })
    .catch(() => null);
  return res?.data?.accessToken || null;
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401 && !error.config.__retried) {
      if (!refreshing) refreshing = refresh();
      const token = await refreshing.finally(() => (refreshing = null));
      if (token) {
        setAccessToken(token);
        error.config.__retried = true;
        error.config.headers = error.config.headers || {};
        error.config.headers.Authorization = `Bearer ${token}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
