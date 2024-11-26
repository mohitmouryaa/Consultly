import React, { memo, useMemo } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { images } from "../constants";
import { convertChatDate } from "../lib/utils";
import { useSocket } from "../providers/socketProvider";
import { useAppDispatch } from "../../store";
import { setCurrentChatInfo } from "../../store/slices/chatSlice";

export default memo(function MessageBox({ item }: MessageBoxProps) {
  const dispatch = useAppDispatch();
  const { onlineUsers } = useSocket();

  const imageSource = useMemo(() => {
    return item.avatar ? { uri: item.avatar } : images.profilePic;
  }, [item.avatar]);

  const handlePress = () => {
    dispatch(setCurrentChatInfo(item));
  };

  const isUserOnline = useMemo(() => {
    return item.members.some(member => onlineUsers.has(member));
  }, [onlineUsers, item.members]);

  const lastMessageDate = useMemo(() => {
    return convertChatDate(item?.latestMessage?.createdAt);
  }, [item?.latestMessage?.createdAt]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="flex-row items-center justify-between border-b-gray-100 border-b-[1px] py-3">
        <View className="flex flex-row items-center">
          <Image
            source={imageSource}
            alt="profile"
            className="rounded-full w-14 h-14"
          />
          {isUserOnline && (
            <View className="absolute w-2 h-2 bg-green-500 rounded-full left-11 -bottom-[1px]" />
          )}
          <View className="w-7/12 ml-3">
            <Text
              className="overflow-hidden text-lg font-JakartaBold text-ellipsis text-nowrap"
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.name}
            </Text>
            <View className="flex flex-row items-center">
              {item?.latestMessage?.status === "delivered" &&
              item?.messageCount > 0 ? (
                <Text className="flex items-center justify-center px-1.5 py-0.5 mr-2 text-sm text-black bg-green-300 rounded-full">
                  {item.messageCount}
                </Text>
              ) : null}
              <Text
                className="overflow-hidden text-sm font-JakartaLight text-ellipsis text-nowrap"
                numberOfLines={1}
                ellipsizeMode="tail">
                {item?.latestMessage?.content}
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-xs font-JakartaLight">{lastMessageDate}</Text>
      </View>
    </TouchableOpacity>
  );
});
