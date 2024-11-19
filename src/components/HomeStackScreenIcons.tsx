import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

export const ChatsTabBarIcon = ({ color }: { color: string }) => (
  <AntDesign name={"wechat"} size={25} color={color} />
);

export const CallHistoryTabBarIcon = ({ color }: { color: string }) => (
  <AntDesign name={"phone"} size={25} color={color} />
);

export const PlansTabBarIcon = ({ color }: { color: string }) => (
  <AntDesign name={"solution1"} size={25} color={color} />
);

export const ProfileTabBarIcon = ({ color }: { color: string }) => (
  <AntDesign name={"user"} size={25} color={color} />
);
