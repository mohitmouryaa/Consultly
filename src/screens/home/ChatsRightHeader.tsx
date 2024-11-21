import React from "react";
import { TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function ChatsRightHeader() {
  return (
    <View className="flex flex-row mr-3">
      {/* Search Icon */}
      <TouchableOpacity
        className="ml-4 mr-2.5"
        onPress={() => {
          console.log("Search icon pressed");
        }}>
        <AntDesign name="search1" size={25} color="#000000" />
      </TouchableOpacity>

      {/* Bell Icon (or any other icon) */}
      <TouchableOpacity
        className="ml-2.5 mr-2.5"
        onPress={() => {
          console.log("Dots icon pressed");
        }}>
        <AntDesign name="ellipsis1" size={25} color="#00000" />
      </TouchableOpacity>
    </View>
  );
}
