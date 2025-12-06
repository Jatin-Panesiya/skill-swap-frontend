import axiosInstance from "./axios";
import type { ILoginUser, IRegisterUser, IUser } from "./request.type";

export const registerUser = (payload: IRegisterUser) =>
  axiosInstance.post("users/register", payload);

export const loginUser = (payload: ILoginUser) =>
  axiosInstance.post("users/login", payload);

export const getLoggedInUser = () => axiosInstance.get("users/get-user");

export const getUserById = (userId: string) =>
  axiosInstance.get(`users/get-user/${userId}`);

export const logoutUser = () => axiosInstance.get("users/logout");

export const updateUser = (userId: string, payload: IUser) =>
  axiosInstance.put(`users/update-user/${userId}`, payload);

export const getActiveMatches = () =>
  axiosInstance.get(`users/get-active-matches`);

export const getUsers = (query?: string) => {
  const url = query ? `users/get-all?${query}` : "users/get-all";
  return axiosInstance.get(url);
};

export const getAllUsers = () => axiosInstance.get("users/admin/get-all-users");

export const deleteUser = (userId: string) =>
  axiosInstance.delete(`users/admin/delete-user/${userId}`);

export const sendMatchRequest = (recipientId: string) =>
  axiosInstance.post("matches/send-request", { recipientId });

export const acceptMatch = (matchId: string) =>
  axiosInstance.post("matches/accept", { matchId });

export const rejectMatch = (matchId: string) =>
  axiosInstance.post("matches/reject", { matchId });

export const withdrawMatchRequest = (matchId: string) =>
  axiosInstance.post("matches/withdraw", { matchId });

export const getAcceptedMatches = () =>
  axiosInstance.get("matches/accepted");

export const getPendingRequests = () =>
  axiosInstance.get("matches/pending");

export const getSentRequests = () =>
  axiosInstance.get("matches/sent");

export const sendMessage = (receiverId: string, content: string) =>
  axiosInstance.post("messages/send", { receiverId, content });

export const getConversation = (otherUserId: string) =>
  axiosInstance.get(`messages/conversation/${otherUserId}`);

export const getAllConversations = () =>
  axiosInstance.get("messages/conversations");

export const markAsRead = (otherUserId: string) =>
  axiosInstance.post("messages/mark-read", { otherUserId });

export const createBooking = (payload: {
  providerId: string;
  skill: string;
  date: string;
  time: string;
  notes?: string;
}) => axiosInstance.post("bookings/create", payload);

export const acceptBooking = (bookingId: string) =>
  axiosInstance.post("bookings/accept", { bookingId });

export const rejectBooking = (bookingId: string) =>
  axiosInstance.post("bookings/reject", { bookingId });

export const cancelBooking = (bookingId: string) =>
  axiosInstance.post("bookings/cancel", { bookingId });

export const getUpcomingBookings = () =>
  axiosInstance.get("bookings/upcoming");

export const getPastBookings = () =>
  axiosInstance.get("bookings/past");

export const getAllBookings = () =>
  axiosInstance.get("bookings/all");

export const getPendingBookings = () =>
  axiosInstance.get("bookings/pending");