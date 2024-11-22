import React, { memo, useMemo } from "react";
import { Text, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useAppSelector } from "../../../store";
import { convertChatDate } from "../../lib/utils";

const RenderMessage = ({ item }: { item: any }) => {
  const userId = useAppSelector(state => state.user._id);
  const isMyMessage = item?.sender?._id === userId;

  const messageTime = useMemo(() => {
    return convertChatDate(item.createdAt);
  }, [item.createdAt]);

  return (
    <View
      className={`max-w-[70%] p-2.5 mx-2.5 rounded-xl my-1.5 ${
        isMyMessage ? "self-end bg-[#f0f0f0]" : "self-start bg-[#e3be81]"
      }`}>
      <Text className="text-base">{item.content}</Text>
      <View className="flex flex-row items-center justify-between mt-2">
        <Text className="text-xs text-[#888] mr-1.5">{messageTime}</Text>
        {isMyMessage ? renderStatusIcon(item.status) : null}
      </View>
    </View>
  );
};

const renderStatusIcon = (status: string) => {
  switch (status) {
    case "not_sent":
      return (
        <AntDesign
          name="clockcircleo"
          size={12}
          className="ml-1.5 text-[#888]"
        />
      ); // Not sent icon
    case "sent":
      return (
        <AntDesign name="check" size={12} className="ml-1.5 text-[#888]" />
      ); // Sent icon (single check circle)
    case "delivered":
      return (
        <AntDesign
          name="checkcircleo"
          size={12}
          className="ml-1.5 text-[#888]"
        />
      ); // Delivered icon (filled double check)
    case "seen":
      return (
        <AntDesign
          name="checkcircleo"
          size={12}
          className="ml-1.5 text-[#87CEEB]"
        />
      ); // Seen icon (eye outline)
    default:
      return null;
  }
};

export default memo(RenderMessage);
