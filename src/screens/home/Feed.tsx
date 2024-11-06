import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Feed() {
  return (
    <SafeAreaView className="items-center justify-center flex-1 bg-white">
      <Text className="text-3xl font-bold">FEED</Text>
    </SafeAreaView>
  );
}
