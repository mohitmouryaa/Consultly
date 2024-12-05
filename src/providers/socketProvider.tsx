import Config from "react-native-config";
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
} from "../constants";
import { chatApi } from "../../store/api";
import { setCallerDetails, setCallModal } from "../../store/slices/chatSlice";

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

      const newSocket = io(`http://89.40.9.101:3100`, {
        withCredentials: true,
        transports: ["websocket"],
        auth: {
          token,
        },
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
        dispatch(setCallModal(true));
        dispatch(setCallerDetails({ ...caller, chatId }));
      });

      newSocket?.on(CALL_CANCELLED, () => {
        dispatch(setCallModal(false));
        dispatch(setCallerDetails({}));
      });

      socketRef.current = newSocket;
    };

    initializeSocket();

    return () => {
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
