import { useNavigation, useRoute } from "@react-navigation/native";
import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "../../providers/socketProvider";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  START_TYPING,
  tabBarStyle,
} from "../../constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "../../../store";
import { getCurrentTime } from "../../lib/utils";
import RenderMessage from "../../components/Chats/RenderMessage";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";
import { useGetChatByIdQuery } from "../../../store/api";

export default function Chat() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const userId = useAppSelector(state => state.user._id);
  const { _id: chatId, members, isOtherUserTyping } = useCurrentChatMember();
  const { socket } = useSocket();
  const { data } = useGetChatByIdQuery({ chatId });
  const messages = useMemo(() => data?.messages || [], [data]);
  const [messageText, setMessageText] = useState("");

  useLayoutEffect(() => {
    // HIDE THE TAB BAR FOR THIS SCREN
    navigation?.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    socket?.emit(CHAT_JOINED, { chatId: chatId, userId });

    return () => {
      // RESTORE THE TAB BAR
      navigation
        ?.getParent()
        ?.setOptions({ ...tabBarStyle(route.params?.tabBarHeight) });
      // LEAVE THE CHAT ROOM
      socket?.emit(CHAT_LEAVED, { chatId: chatId });
    };
  }, [navigation, route.params?.tabBarHeight, userId, chatId, socket]);

  const sendMessage = useCallback(() => {
    if (messageText.trim().length > 0) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: messageText,
        user: "me", // Assuming 'me' is the current user
        time: getCurrentTime(),
      };
      // setMessages(prev => [...prev, newMessage]);
      // TODO:Send the message to the server
      setMessageText(""); // Clear input field after sending
    }
  }, [messageText, messages]);

  const handleValueChange = useCallback(
    (text: string) => {
      socket?.emit(START_TYPING, { chatId, members });
      setMessageText(text);
    },
    [chatId, members, socket],
  );

  return (
    <SafeAreaView className="flex h-full bg-white">
      {/* HEADER */}
      <View className="flex flex-1 bg-white">
        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <RenderMessage item={item} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          inverted={false}
        />
        {isOtherUserTyping && (
          <Text className="my-2 text-xl font-bold">Typing....</Text>
        )}

        {/* Input field to send new messages */}
        <View className="flex flex-row items-center p-2.5 border-t-[1px] bg-[#fff] border-[##ddd]">
          <TextInput
            className="flex flex-1 h-10 border-[#ccc] border-[1px] rounded-3xl px-2.5 bg-[#f0f0f0]"
            placeholder="Type a message..."
            value={messageText}
            onChangeText={handleValueChange}
          />
          <TouchableOpacity
            onPress={sendMessage}
            className="ml-2.5 bg-[#FFA001] px-2 py-3.5 rounded-2xl">
            <Text className="text-base text-[#fff]">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
