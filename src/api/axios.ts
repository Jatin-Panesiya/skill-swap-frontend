// src/lib/axios.js
import axios from "axios";
import { API_URL } from "../utils/environment";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
