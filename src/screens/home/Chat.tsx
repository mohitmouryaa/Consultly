import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "../../providers/socketProvider";
import { CHAT_JOINED, CHAT_LEAVED, tabBarStyle } from "../../constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "../../../store";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";
import MessageList from "../../components/Chats/MessageList";
import SendMsgInput from "../../components/Chats/SendMsgInput";

export default function Chat() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const userId = useAppSelector(state => state.user._id);
  const { _id: chatId } = useCurrentChatMember();
  const { socket } = useSocket();

  useLayoutEffect(() => {
    // HIDE THE TAB BAR FOR THIS SCREEN
    navigation?.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    // JOIN THE CHAT ROOM
    socket?.emit(CHAT_JOINED, { chatId: chatId, userId });

    return () => {
      // RESTORE THE TAB BAR
      navigation?.getParent()?.setOptions({ ...tabBarStyle() });
      // LEAVE THE CHAT ROOM
      socket?.emit(CHAT_LEAVED, { chatId: chatId });
    };
  }, [navigation, userId, socket]);

  return (
    <SafeAreaView className="flex h-full bg-white">
      {/* HEADER */}
      <View className="flex flex-1 bg-white">
        {/* Chat Messages */}
        <MessageList />
        {/* Input field to send new messages */}
        <SendMsgInput />
      </View>
    </SafeAreaView>
  );
}
