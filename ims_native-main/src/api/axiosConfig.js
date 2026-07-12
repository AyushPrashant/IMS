import axios from "axios";
import serverUrl from "./urls";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
    baseURL: serverUrl.baseUrl,
    headers: {
      "Content-Type": "application/json",
      

    },
    withCredentials: true
  });

  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem('auth');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to set authorization header:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
    
  export default instance;