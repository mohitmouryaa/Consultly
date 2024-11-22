import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSocket } from "../providers/socketProvider";
import { useAppDispatch, useAppSelector } from "../../store";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants";
import { useGetChatByIdQuery } from "../../store/api";
import { addNewMessage, setChatMessage } from "../../store/slices/chatSlice";

export default function useCurrentChatMember() {
  const dispatch = useAppDispatch();
  const [isOtherUserTyping, setOtherUserTyping] = useState(false);
  const { members, _id, name } = useAppSelector(
    ({ chat }) => chat.currentChatInfo,
  );
  const chatMessages = useAppSelector(({ chat }) => chat.chatMessages);
  const messages = useMemo(() => chatMessages[_id] || [], [_id, chatMessages]);
  const { data } = useGetChatByIdQuery(
    { chatId: _id, page: 1 },
    { skip: !_id },
  );
  const { onlineUsers, socket } = useSocket();

  const isUserOnline = useMemo(() => {
    return members?.some((member: string) => onlineUsers.has(member)) || false;
  }, [onlineUsers, members]);

  useLayoutEffect(() => {
    socket?.on(NEW_MESSAGE, ({ chatId: senderChatId, message }) => {
      if (senderChatId !== _id) return;
      dispatch(addNewMessage({ chatId: _id, message }));
    });

    return () => {
      socket?.off(NEW_MESSAGE);
    };
  }, [_id, socket, dispatch]);

  useEffect(() => {
    if (data?.messages?.length === 0) return;
    dispatch(setChatMessage({ chatId: _id, messages: data?.messages }));
  }, [data?.messages, _id, dispatch]);

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

  return {
    isUserOnline,
    _id,
    name,
    members,
    isOtherUserTyping,
    messages,
  };
}
