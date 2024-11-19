import React from "react";
import { Image, Text, View } from "react-native";

export default function ChatHeaderTitle() {
  const isOnline = true; // TODO:Replace with actual online status
  return (
    <View className="flex flex-row items-center">
      <Image
        source={{
          uri: "https://plus.unsplash.com/premium_photo-1664476788423-7899ac87bd7f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFsZXxlbnwwfHwwfHx8MA%3D%3D",
        }} // Replace with actual profile image URL
        className="w-10 h-10 rounded-full mr-2.5"
      />
      <View>
        <Text className="text-base font-medium">John Doe</Text>

        <View className="flex flex-row items-center">
          <View className="w-2 h-2 bg-green-500 rounded-full" />
          <Text>{isOnline ? "Online" : "Offline"}</Text>
        </View>
      </View>
    </View>
  );
}
