import React from "react";
import { Text, View } from "react-native";

export default function RenderMessage({ item }: { item: any }) {
  const isMyMessage = item.user === "me";
  return (
    <View className="flex flex-row items-center justify-between my-1.5">
      {/* Time on the opposite side */}
      {isMyMessage ? (
        <Text className="flex text-xs text-[#888] ml-1.5 self-center">
          {item.time}
        </Text>
      ) : null}

      {/* Message bubble */}
      <View
        className={`max-w-[70%] p-2.5 mx-2.5 my-1.5 rounded-lg ${
          isMyMessage ? "self-end bg-[#f0f0f0]" : "self-start bg-[#e3be81]"
        }`}>
        <Text className="text-base">{item.text}</Text>
      </View>

      {/* Time on the opposite side */}
      {!isMyMessage ? (
        <Text className="text-[#888] mr-2.5 self-center text-xs">
          {item.time}
        </Text>
      ) : null}
    </View>
  );
}
