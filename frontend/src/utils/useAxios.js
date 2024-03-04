import axios from "axios";
// import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` }
  });

  axiosInstance.interceptors.request.use(async req => {
    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs(), 'minute') <= 1; // Adds a 1-minute buffer

    if (!isExpired) return req;

    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh
      });

      if (response && response.data) {
        localStorage.setItem("authTokens", JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));

        req.headers.Authorization = `Bearer ${response.data.access}`;
      }

      return req;
    } catch (error) {
      console.error("Token refresh error:", error);
      // Handle error, e.g., redirect to login
      // You might want to clear tokens, redirect to login, etc.
      throw new Error("Token refresh failed");
    }
  });

  return axiosInstance;
};

export default useAxios;