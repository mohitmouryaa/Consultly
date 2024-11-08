import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect, useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "../../providers/socketProvider";
import { icons, tabBarStyle } from "../../constants";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";

export default function Chat() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useMemo(() => route.params.user || {}, [route.params.user]);
  const { onlineUsers } = useSocket();

  const isUserOnline = useMemo(() => {
    return user.members.some((member: any) => onlineUsers.has(member));
  }, [onlineUsers, user.members]);

  useLayoutEffect(() => {
    // HIDE THE TAB BAR FOR THIS SCREN
    navigation.getParent().setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      // RESTORE THE TAB BAR
      navigation
        .getParent()
        .setOptions({ ...tabBarStyle(route.params?.tabBarHeight) });
    };
  }, [navigation, route.params?.tabBarHeight]);

  const handlePress = () => {
    navigation.navigate("chats");
  };
  return (
    <SafeAreaView className="flex h-full bg-white">
      {/* HEADER */}
      <View className="flex flex-row justify-between p-2 mt-3">
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
      </View>
    </SafeAreaView>
  );
}
