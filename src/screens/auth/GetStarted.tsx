import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBtn from "../../components/CustomBtn";
import { images } from "../../constants";
import { StackNavigationProp } from "@react-navigation/stack";

type GetStartedProps = {
  navigation: StackNavigationProp<any>;
};

export default function GetStarted({ navigation }: GetStartedProps) {
  const handleSignUpBtnPress = () => {
    navigation.push("register");
  };

  const handleSignInBtnPress = () => {
    navigation.push("login");
  };
  return (
    <SafeAreaView className="flex items-center justify-between h-full bg-white">
      <Image source={images.reactLogo} alt="react-logo" />
      <View className="flex items-center mt-8">
        <Text className="text-2xl font-bold text-black">
          Let's Get Started!
        </Text>
        <Text className="mt-4 text-sm font-light text-black">
          Let's dive into your account
        </Text>
      </View>

      {/* AUTH BUTTONS */}
      {/* <View className="flex-col items-center justify-around w-full px-6 mt-12"> */}
      <View className="flex-col items-center w-full px-6">
        <CustomBtn title="Sign up" onPress={handleSignUpBtnPress} />
        <View className={"h-3"} />
        <CustomBtn
          title="Sign in"
          className="bg-[#faf2ea]"
          textClassName="text-orange-300"
          onPress={handleSignInBtnPress}
        />
      </View>

      {/* FOOTER SECTION  */}
      <View className="flex flex-row items-center justify-around w-full px-16 mb-5">
        <Text className="text-sm font-light text-black">Privacy Policy</Text>
        <Text className="text-sm font-light text-black">Terms of Service</Text>
      </View>
    </SafeAreaView>
  );
}
