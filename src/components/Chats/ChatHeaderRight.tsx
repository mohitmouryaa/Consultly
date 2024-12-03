import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function ChatHeaderRight() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleVideoCall = () => {
    navigation.navigate("call");
  };
  return (
    <View className="flex flex-row mx-2.5">
      <TouchableOpacity className="mx-1 ml-4 mr-2.5">
        <AntDesign name="phone" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity className="mx-1 ml-4" onPress={handleVideoCall}>
        <AntDesign name="videocamera" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
}
