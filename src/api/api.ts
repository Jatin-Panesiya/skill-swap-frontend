import axiosInstance from "./axios";
import type { ILoginUser, IRegisterUser, IUser } from "./request.type";

export const registerUser = (payload: IRegisterUser) =>
  axiosInstance.post("users/register", payload);

export const loginUser = (payload: ILoginUser) =>
  axiosInstance.post("users/login", payload);

export const getLoggedInUser = () => axiosInstance.get("users/get-user");

export const logoutUser = () => axiosInstance.get("users/logout");

export const updateUser = (userId: string, payload: IUser) =>
  axiosInstance.put(`users/update-user/${userId}`, payload);

export const getActiveMatches = (userId: string) =>
  axiosInstance.get(`users/get-active-matches/${userId}`);
