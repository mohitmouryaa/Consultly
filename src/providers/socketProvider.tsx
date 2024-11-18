import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "../../store";
import { getToken } from "../lib/secureStore";
import { CHAT_LEAVED, ONLINE_USERS } from "../constants";
import Config from "react-native-config";

interface SocketContextProps {
  socket: Socket | null;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const userId = useAppSelector(state => state.user._id);
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initializeSocket = async () => {
      const token = await getToken();

      const newSocket = io(`${Config.SERVER_URL}`, {
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

      newSocket.on(ONLINE_USERS, (data: string[]) => {
        setOnlineUsers(new Set(data));
      });

      socketRef.current = newSocket;
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current.emit(CHAT_LEAVED, { userId: userId });
      }
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
