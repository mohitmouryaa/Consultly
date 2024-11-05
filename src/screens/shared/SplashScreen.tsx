import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  return (
    <SafeAreaView className="items-center justify-center flex-1">
      <Text className="text-2xl">Loading...</Text>
    </SafeAreaView>
  );
}
