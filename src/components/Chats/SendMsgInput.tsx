import { memo, useCallback, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../../constants";
import { useSocket } from "../../providers/socketProvider";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../store";
import { chatApi } from "../../../store/api";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";

export default memo(function SendMsgInput() {
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useAppSelector(state => state.user._id);
  const { _id: chatId, members } = useCurrentChatMember();
  const { socket } = useSocket();
  const textMsgRef = useRef<string>("");
  const [refresh, setRefresh] = useState(1); // USED TO REFRESH THE INPUT FIELD

  const handleTyping = useCallback(
    (text: string) => {
      textMsgRef.current = text;
      if (!typingTimeoutRef.current) {
        socket?.emit(START_TYPING, { chatId, members });
      } else {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit(STOP_TYPING, { chatId, members });
        typingTimeoutRef.current = null;
      }, 500); // AFTER 500ms OF NO TYPING, STOP TYPING
    },
    [chatId, members, socket],
  );

  const handleSendBtn = useCallback(() => {
    if (textMsgRef.current.trim() === "") return;
    socket?.emit(NEW_MESSAGE, { chatId, members, message: textMsgRef.current });
    const newMessage = {
      content: textMsgRef.current,
      sender: { _id: userId },
      createdAt: new Date().toISOString(),
    };
    // UPDATE THE CACHED MESSAGES RETURN FROM THE API
    dispatch(
      chatApi.util.updateQueryData(
        "getChatById",
        { chatId, page: 1 },
        (draft: any) => {
          draft.messages.push(newMessage);
        },
      ) as any,
    );
    setRefresh(prev => prev + 1);
  }, [chatId, members, socket]);

  return (
    <View className="flex flex-row items-center p-2.5 border-t-[1px] bg-[#fff] border-[##ddd]">
      <TextInput
        className="flex flex-1 h-10 border-[#ccc] border-[1px] rounded-3xl px-2.5 bg-[#f0f0f0]"
        placeholder="Type a message..."
        onChangeText={handleTyping}
        key={refresh?.toString()}
      />
      <TouchableOpacity
        className="ml-2.5 bg-[#FFA001] px-2 py-3.5 rounded-2xl"
        onPress={handleSendBtn}>
        <Text className="text-base text-[#fff]">Send</Text>
      </TouchableOpacity>
    </View>
  );
});
