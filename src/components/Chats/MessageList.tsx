import { Fragment, memo, useCallback, useEffect, useRef } from "react";
import { FlatList, Text } from "react-native";
import RenderMessage from "./RenderMessage";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";

export default memo(function MessageList() {
  const initialRender = useRef(true);
  const userIsAtBottom = useRef(true);
  const messageListRef = useRef<FlatList>(null);
  const { messages } = useCurrentChatMember();

  const scrollToEnd = useCallback((animated = true) => {
    messageListRef.current?.scrollToEnd({ animated });
    userIsAtBottom.current = true;
  }, []);

  const handleContentSizeChange = useCallback(() => {
    if (initialRender.current) {
      messageListRef.current?.scrollToEnd({ animated: false });
      initialRender.current = false;
      return;
    }
    if (userIsAtBottom.current) {
      scrollToEnd();
    }
  }, [scrollToEnd]);

  useEffect(() => {
    if (messageListRef.current && userIsAtBottom.current) {
      scrollToEnd(true);
    }
  }, [messages, scrollToEnd]);

  return (
    <Fragment>
      {/* MESSAGES LIST */}
      <FlatList
        ref={messageListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <RenderMessage item={item} />}
        showsVerticalScrollIndicator={false}
        inverted={false}
        onContentSizeChange={handleContentSizeChange}
      />
    </Fragment>
  );
});
