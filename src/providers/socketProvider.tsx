import io, { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../store";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getToken } from "../lib/secureStore";
import {
  CALL_CANCELLED,
  CALL_RECIEVED,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  UPDATE_CALLER,
} from "../constants";
import { chatApi } from "../../store/api";
import {
  setCallerDetails,
  setCallReceiveModal,
} from "../../store/slices/chatSlice";
import { SERVER_URL } from "@env";

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.user._id);
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if ((socketRef.current && socketRef.current.connected) || !userId) {
      return;
    }
    const initializeSocket = async () => {
      const token = await getToken();
      if (!token) return;
      const auth = { token };
      const newSocket = io(`${SERVER_URL}`, {
        withCredentials: true,
        transports: ["websocket"],
        auth,
        timestampRequests: true,
      });

      newSocket.on("connect", () => {
        console.log("SOCKET CONNECTED...");
      });

      newSocket.on("disconnect", () => {
        console.log("SOCKET DISCONNECTED...");
      });
      newSocket.emit(CHAT_JOINED, { userId });

      newSocket.on(ONLINE_USERS, (data: string[]) => {
        setOnlineUsers(new Set(data));
      });

      newSocket?.on(NEW_MESSAGE_ALERT, ({ chatId, latestMessage }) => {
        if (!chatId) return;
        dispatch(
          chatApi.util.updateQueryData(
            "getChatById",
            { chatId, page: 1 }, // Query parameters
            (draft: any) => {
              draft.messages.push(latestMessage);
            },
          ) as any,
        );
      });

      newSocket?.on(CALL_RECIEVED, ({ caller, chatId }) => {
        dispatch(setCallReceiveModal(true));
        dispatch(setCallerDetails({ ...caller, chatId }));
      });

      newSocket?.on(CALL_CANCELLED, () => {
        dispatch(setCallReceiveModal(false));
        dispatch(setCallerDetails({}));
      });

      newSocket?.on(UPDATE_CALLER, ({ caller, id }) => {
        dispatch(setCallerDetails({ ...caller, id }));
      });

      socketRef.current = newSocket;
    };

    initializeSocket();

    return () => {
      console.log("SOCKET UNMOUNT DISCONNECTED...");
      if (socketRef.current) {
        socketRef.current.emit(CHAT_LEAVED, { userId });
        socketRef.current.close();
      }
    };
  }, [userId, dispatch]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
