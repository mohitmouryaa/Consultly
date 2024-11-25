import {
  Fragment,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { FlatList, View, Text } from "react-native";
import { useGetChatByIdQuery } from "../../../store/api";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setChatMessage } from "../../../store/slices/chatSlice";
import RenderMessage from "./RenderMessage";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";

export default memo(function MessageList() {
  const { _id } = useCurrentChatMember();
  const dispatch = useAppDispatch();
  const messsageListRef = useRef<FlatList>(null);
  const isInternetConnected = useAppSelector(
    ({ misc }) => misc.isInternetConnected,
  );
  const chatMessages = useAppSelector(({ chat }) => chat.chatMessages);
  const { data } = useGetChatByIdQuery(
    { chatId: _id, page: 1 },
    { skip: !_id },
  );

  const messages = useMemo(() => chatMessages[_id] || [], [_id, chatMessages]);

  useLayoutEffect(() => {
    if (!_id || !isInternetConnected) return;
    dispatch(setChatMessage({ chatId: _id, messages: data?.messages || [] }));
  }, [data?.messages, _id, dispatch, isInternetConnected]);

  useEffect(() => {
    messsageListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <Fragment>
      {/* MESSAGES LIST */}
      <FlatList
        ref={messsageListRef}
        data={messages}
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
