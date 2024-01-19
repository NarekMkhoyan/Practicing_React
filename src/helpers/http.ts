import axios from "axios";
import { LocalStorageItemsEnum } from "../constants/localStorage-items.enum";

const instance = axios.create({
  baseURL: "",
});

instance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem(LocalStorageItemsEnum.TOKEN);
    if (authToken) {
      config.params = { auth: authToken };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
