import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CallHistory() {
  return (
    <SafeAreaView className="items-center justify-center flex-1 bg-white">
      <Text className="text-3xl font-bold">Call History</Text>
    </SafeAreaView>
  );
}
