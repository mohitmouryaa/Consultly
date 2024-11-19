import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "../../providers/socketProvider";
import { CHAT_JOINED, CHAT_LEAVED, tabBarStyle } from "../../constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "../../../store";
import { getCurrentTime } from "../../lib/utils";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function Chat() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const chat = useMemo(() => route.params.chat || {}, [route.params.chat]);
  const userId = useAppSelector(state => state.user._id);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello!", user: "other", time: "09:00", status: "sent" },
    {
      id: "2",
      text: "Hi, how are you?",
      user: "me",
      time: "09:02",
      status: "sent",
    },
    {
      id: "3",
      text: "I am fine, thank you!",
      user: "other",
      time: "09:03",
      status: "sent",
    },
  ]);
  const { onlineUsers, socket } = useSocket();

  const isUserOnline = useMemo(() => {
    return chat.members.some((member: any) => onlineUsers.has(member));
  }, [onlineUsers, chat.members]);

  useLayoutEffect(() => {
    // HIDE THE TAB BAR FOR THIS SCREN
    navigation?.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    console.log("Chat screen mounted", userId);
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
        //status: "delivered",
        status: "seen",
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageText(""); // Clear input field after sending
    }
  }, [messageText, messages]);

  const renderMessage = ({ item }) => {
    const isMyMessage = item.user === "me";

    // Function to render the appropriate AntDesign icon based on the message status
    const renderStatusIcon = status => {
      switch (status) {
        case "not_sent":
          return (
            <AntDesign
              name="clockcircleo"
              size={12}
              style={styles.statusIcon}
            />
          ); // Not sent icon
        case "sent":
          return <AntDesign name="check" size={12} style={styles.statusIcon} />; // Sent icon (single check circle)
        case "delivered":
          return (
            <AntDesign
              name="checkcircleo"
              size={12}
              style={styles.statusIcon}
            />
          ); // Delivered icon (filled double check)
        case "seen":
          return (
            <AntDesign
              name="checkcircleo"
              size={12}
              style={[styles.statusIcon, { color: "#87CEEB" }]}
            />
          ); // Seen icon (eye outline)
        default:
          return null;
      }
    };
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={styles.timeIconRow}>
          <Text style={styles.time}>{item.time}</Text>
          {isMyMessage && renderStatusIcon(item.status)}{" "}
          {/* Status icon only for my messages */}
        </View>
      </View>
      // <View style={styles.messageRow}>
      //   {/* Time on the opposite side */}
      //   {isMyMessage ? <Text style={styles.timeLeft}>{item.time}</Text> : null}

      //   {/* Message bubble */}
      //   <View
      //     style={[
      //       styles.messageContainer,
      //       isMyMessage ? styles.myMessage : styles.otherMessage,
      //     ]}>
      //     <Text style={styles.messageText}>{item.text}</Text>
      //   </View>

      //   {/* Time on the opposite side */}
      //   {!isMyMessage ? (
      //     <Text style={styles.timeRight}>{item.time}</Text>
      //   ) : null}
      // </View>
    );
  };

  return (
    <SafeAreaView className="flex h-full bg-white">
      {/* HEADER */}
      {/* <View className="flex flex-row justify-between p-2 mt-3">
        <View className="flex flex-row">
          <TouchableOpacity className="my-auto" onPress={handlePress}>
            <Image source={icons.backArrowIcon} className="w-7 h-7" />
          </TouchableOpacity>
          <View className="w-3/6 ml-4">
            <Text
              className="overflow-hidden text-lg font-JakartaBold text-ellipsis text-nowrap"
              numberOfLines={1}
              ellipsizeMode="tail">
              {user.name}
            </Text>
            <Text
              className="overflow-hidden text-xs font-JakartaLight text-ellipsis text-nowrap"
              numberOfLines={1}
              ellipsizeMode="tail">
              {isUserOnline ? "Available now" : "Offline"}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between gap-4">
          <TouchableOpacity>
            <Feather name="video" size={27} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo
              name="dots-three-vertical"
              size={25}
              color="black"
              className=""
            />
          </TouchableOpacity>
        </View>
      </View> */}
      <View style={styles.container}>
        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          // onContentSizeChange={() =>
          //   flatListRef.current?.scrollToEnd({ animated: true })
          // }
          // onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          // Disable the inverted prop, which could flip the order
          inverted={false}
          //inverted
          // Scroll to the bottom when the list changes (new message is added)
        />

        {/* Input field to send new messages */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "bg-white",
  },
  messageContainer: {
    maxWidth: "70%",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#f0f0f0",
  },
  otherMessage: {
    alignSelf: "flex-start",
    //backgroundColor: "#4ed197",
    backgroundColor: "#e3be81",
  },
  messageText: {
    fontSize: 16,
  },
  messageRow: {
    flexDirection: "row", // Align message and time in a row
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  timeLeft: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
    //alignSelf: "flex-start", // Time for the other user (left)
    alignSelf: "center",
  },
  timeRight: {
    fontSize: 12,
    color: "#888",
    marginRight: 5,
    //alignSelf: "flex-end", // Time for "me" (right)
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  sendButton: {
    marginLeft: 10,
    //backgroundColor: "#007AFF",
    backgroundColor: "#FFA001",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  timeIconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginRight: 5,
  },
  statusIcon: {
    marginLeft: 5,
    color: "#888", // Default icon color (you can adjust it as needed)
  },
});
