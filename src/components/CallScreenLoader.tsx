// CallScreenLoader.tsx
import React, { memo } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../store";

const CallScreenLoader: React.FC = () => {
  const isLoading = useAppSelector(state => state.chat.callLoading);
  if (!isLoading) return null;

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0, 0, 0, 0.5)] flex justify-center items-center z-[1000]">
      <SafeAreaView className="flex items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2.5 text-lg text-[#fff]">Starting Call...</Text>
      </SafeAreaView>
    </View>
  );
};

export default memo(CallScreenLoader);
