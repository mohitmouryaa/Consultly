import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useGetMyChatsQuery } from "../../../store/api";
import MessageBox from "../../components/MessageBox";

export default function Chats() {
  const { data, isLoading: refreshing, refetch } = useGetMyChatsQuery("");
  const chats = data?.chats || [];

  return (
    <View className="w-screen h-full px-1 bg-white">
      <FlatList
        data={chats}
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
      />
    </View>
  );
}
