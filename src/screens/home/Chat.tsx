import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "../../providers/socketProvider";
import { CHAT_JOINED, CHAT_LEAVED, tabBarStyle } from "../../constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "../../../store";
import { getCurrentTime } from "../../lib/utils";
import RenderMessage from "../../components/Chats/RenderMessage";

export default function Chat() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const chat = useMemo(() => route.params.chat || {}, [route.params.chat]);
  const userId = useAppSelector(state => state.user._id);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello!", user: "other", time: "09:00" },
    { id: "2", text: "Hi, how are you?", user: "me", time: "09:02" },
    { id: "3", text: "I am fine, thank you!", user: "other", time: "09:03" },
  ]);
  const { socket } = useSocket();

  useLayoutEffect(() => {
    // HIDE THE TAB BAR FOR THIS SCREN
    navigation?.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    socket?.emit(CHAT_JOINED, { chatId: chat._id, userId });

    return () => {
      // RESTORE THE TAB BAR
      navigation
        ?.getParent()
        ?.setOptions({ ...tabBarStyle(route.params?.tabBarHeight) });
      // LEAVE THE CHAT ROOM
      socket?.emit(CHAT_LEAVED, { chatId: chat._id });
    };
  }, [navigation, route.params?.tabBarHeight, userId, chat._id, socket]);

  const sendMessage = useCallback(() => {
    if (messageText.trim().length > 0) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: messageText,
        user: "me", // Assuming 'me' is the current user
        time: getCurrentTime(),
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageText(""); // Clear input field after sending
    }
  }, [messageText, messages]);

  return (
    <SafeAreaView className="flex h-full bg-white">
      {/* HEADER */}
      <View className="flex flex-1 bg-white">
        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={RenderMessage}
          inverted={false}
        />

        {/* Input field to send new messages */}
        <View className="flex flex-row items-center p-2.5 border-t-[1px] bg-[#fff] border-[##ddd]">
          <TextInput
            className="flex flex-1 h-10 border-[#ccc] border-[1px] rounded-3xl px-2.5 bg-[#f0f0f0]"
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
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
