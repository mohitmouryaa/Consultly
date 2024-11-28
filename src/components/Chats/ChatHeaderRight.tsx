import React from "react";
import { TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { StreamClientProvider } from "../../providers/streamClientProvider";

export default function ChatHeaderRight() {
  return (
    <StreamClientProvider>
      <View className="flex flex-row mx-2.5">
        <TouchableOpacity className="mx-1 ml-4 mr-2.5">
          <AntDesign name="phone" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="mx-1 ml-4">
          <AntDesign name="videocamera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </StreamClientProvider>
  );
}
