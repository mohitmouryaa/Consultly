import axios from "axios";
import { getToken } from "./secureStore";
import { store } from "../../store";
import { SERVER_URL } from "@env";
import { resetState } from "../../store/actions/resetState";

const controllers = new Map<string, AbortController>();

const httpClient = axios.create({
  baseURL: `${SERVER_URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

httpClient.interceptors.request.use(
  async config => {
    console.log("config", `${config.baseURL}/${config.url}`);
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle AbortController
    const key = config.url || "";
    if (controllers.has(key)) {
      controllers.get(key)?.abort();
      controllers.delete(key);
    }
    const controller = new AbortController();
    controllers.set(key, controller);
    config.signal = controller.signal;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error?.response?.status === 401) {
      store.dispatch(resetState());
    }
    return Promise.reject(error);
  },
);

export default httpClient;
