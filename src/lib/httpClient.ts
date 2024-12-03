import axios from "axios";
import { deleteToken, getToken } from "./secureStore";
import Config from "react-native-config";
import { store } from "../../store";
import { clearUser } from "../../store/slices/userSlice";

const controllers = new Map<string, AbortController>();

const httpClient = axios.create({
  baseURL: `http://89.40.9.101:3100/api/v1`,
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
    console.log("Fetch", { response: error.response });
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  response => {
    // console.log("Fetch", { response });
    return response;
  },
  async error => {
    if (error?.response?.status === 401) {
      // console.log("Fetch", { response: error.response });
      await deleteToken();
      store.dispatch(clearUser());
    }
    return Promise.reject(error);
  },
);

export default httpClient;
