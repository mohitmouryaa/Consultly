import { Fragment, memo, useEffect, useRef } from "react";
import { FlatList, View, Text } from "react-native";
import { useGetChatByIdQuery } from "../../../store/api";
import { useAppSelector } from "../../../store";
import RenderMessage from "./RenderMessage";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";

export default memo(function MessageList() {
  const { _id } = useCurrentChatMember();
  const messageListRef = useRef<FlatList>(null);
  const isInternetConnected = useAppSelector(
    ({ misc }) => misc.isInternetConnected,
  );
  const { data } = useGetChatByIdQuery(
    { chatId: _id, page: 1 },
    { skip: !_id || !isInternetConnected },
  );

  useEffect(() => {
    messageListRef.current?.scrollToEnd({ animated: true });
  }, [data?.messages]);

  return (
    <Fragment>
      {/* MESSAGES LIST */}
      <FlatList
        ref={messageListRef}
        data={data?.messages || []}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <RenderMessage item={item} />}
        showsVerticalScrollIndicator={false}
        inverted={false}
        ListEmptyComponent={
          <View className="flex items-center justify-center h-full">
            <Text className="text-gray-500">No messages available</Text>
          </View>
        }
      />
    </Fragment>
  );
});
