import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getLoggedInUser } from "../../api/api";
import type { IMessage } from "../../api/request.type";
import { API_URL } from "../../utils/environment";

const getSocketURL = () => {
  if (API_URL) {
    const url = API_URL.replace(/\/api\/?$/, "");
    return url;
  }
  const defaultURL = "http://localhost:8080";
  return defaultURL;
};

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const initSocket = async () => {
      try {
        const socketURL = getSocketURL();

        const newSocket = io(socketURL, {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity,
          forceNew: false,
          withCredentials: true,
          autoConnect: true,
        });

        newSocket.on("connect", () => {
          setConnected(true);
        });

        newSocket.on("disconnect", (reason) => {
          setConnected(false);
        });

        newSocket.on("connect_error", (error) => {
          setConnected(false);
        });

        newSocket.on("reconnect", (attemptNumber) => {
          setConnected(true);
        });

        newSocket.on("reconnect_attempt", (attemptNumber) => {
        });

        newSocket.on("reconnect_error", (error) => {
        });

        newSocket.on("reconnect_failed", () => {
          setConnected(false);
        });

        newSocket.on("error", (error: { message: string }) => {
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      } catch (error) {
      }
    };

    initSocket();
  }, []);

  const sendMessage = (receiverId: string, content: string) => {
    if (socket && connected) {
      socket.emit("send_message", { receiverId, content });
    }
  };

  return {
    socket,
    connected,
    messages,
    sendMessage,
    setMessages,
  };
};

