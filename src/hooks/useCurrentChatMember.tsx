import { useEffect, useMemo, useState } from "react";
import { useSocket } from "../providers/socketProvider";
import { useAppSelector } from "../../store";
import { START_TYPING, STOP_TYPING } from "../constants";

export default function useCurrentChatMember() {
  const [isOtherUserTyping, setOtherUserTyping] = useState(false);

  const { members, _id, name } = useAppSelector(
    state => state.user.currentChatDetails,
  );
  const { onlineUsers, socket } = useSocket();

  useEffect(() => {
    socket?.on(START_TYPING, ({ chatId }) => {
      if (chatId !== _id) return;
      setOtherUserTyping(true);
    });

    socket?.on(STOP_TYPING, ({ chatId }) => {
      if (chatId !== _id) return;
      setOtherUserTyping(false);
    });

    return () => {
      socket?.off(START_TYPING);
      socket?.off(STOP_TYPING);
    };
  }, []);

  const isUserOnline = useMemo(() => {
    return members?.some((member: string) => onlineUsers.has(member)) || false;
  }, [onlineUsers, members]);

  return {
    isUserOnline,
    _id,
    name,
    members,
    isOtherUserTyping,
  };
}
