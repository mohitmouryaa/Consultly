import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScreenHeader({ title, navigation }: ScreenHeaderProps) {
  return (
    <SafeAreaView className="px-2 pt-2 bg-white">
      <View className="flex flex-row items-center justify-between w-full pl-3 mb-2">
        <AntDesign
          name="smile-circle"
          size={28}
          color="orange"
          onPress={navigation.openDrawer}
        />
        <View className="pl-6 text-end">
          <Text className="text-2xl font-JakartaBold">{title}</Text>
        </View>
        <View className="flex flex-row items-center justify-between gap-4">
          <AntDesign name="search1" size={28} color="black" className="" />
          <Entypo
            name="dots-three-vertical"
            size={25}
            color="black"
            className=""
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
