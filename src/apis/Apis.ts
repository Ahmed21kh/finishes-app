import axios from "axios";
let defaultUrl = axios.defaults.baseURL || import.meta.env.VITE_API_URL  
export const Axios = axios.create({
    baseURL: defaultUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });