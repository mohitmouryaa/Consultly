import { useMemo } from "react";
import { useSocket } from "../providers/socketProvider";
import { useAppSelector } from "../../store";

export default function useCurrentChatMember() {
  const { members, _id, name } = useAppSelector(
    state => state.user.currentChatDetails,
  );
  const { onlineUsers } = useSocket();

  const isUserOnline = useMemo(() => {
    return members?.some((member: string) => onlineUsers.has(member)) || false;
  }, [onlineUsers, members]);

  return {
    isUserOnline,
    _id,
    name,
  };
}
