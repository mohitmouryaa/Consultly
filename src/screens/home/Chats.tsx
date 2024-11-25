import React, { useLayoutEffect, useRef } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import { useGetMyChatsQuery } from "../../../store/api";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setChatList } from "../../../store/slices/chatSlice";
import MessageBox from "../../components/MessageBox";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

export default function Chats() {
  const dispatch = useAppDispatch();
  const initialRenderRef = useRef(true);
  const currentChatInfo = useAppSelector(state => state.chat.currentChatInfo);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { data, isLoading: refreshing, refetch } = useGetMyChatsQuery("");
  const chatList = useAppSelector(state => state.chat.chatList);
  const isInternetConnected = useAppSelector(
    state => state.misc.isInternetConnected,
  );

  useLayoutEffect(() => {
    if (!isInternetConnected) return;
    dispatch(setChatList(data?.chats || []));
  }, [data?.chats, dispatch, isInternetConnected]);

  useLayoutEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    // REDIRECT TO CHAT SCREEN IF CHAT INFO IS AVAILABLE
    const keys = Object.values(currentChatInfo).length > 0;
    navigation.navigate(keys ? "chat" : "chats");
  }, [currentChatInfo, navigation]);

  return (
    <View className="w-screen h-full px-1 bg-white">
      <FlatList
        data={chatList}
        keyExtractor={_item => _item?._id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          return <MessageBox item={item} />;
        }}
        className="mx-3"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center h-[85vh]">
            <Text className="text-xl font-bold text-gray-500 ">
              No chats available
            </Text>
          </View>
        }
      />
    </View>
  );
}
