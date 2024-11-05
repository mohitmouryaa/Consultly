import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../store";

export default function Welcome() {
  const username = useAppSelector(state => state?.user?.name);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-1 justify-center items-center">
        <Text className="text-2xl">HEYY - {username}</Text>
      </View>
    </SafeAreaView>
  );
}
