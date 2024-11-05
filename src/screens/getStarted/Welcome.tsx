import React, { Fragment, useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { onboarding } from "../../constants";
import CustomBtn from "../../components/CustomBtn";
import type { StackNavigationProp } from "@react-navigation/stack";

type WelcomeProps = {
  navigation: StackNavigationProp<any>;
};

export default function Welcome({ navigation }: WelcomeProps) {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  const handleContinueBtnPress = () => {
    setActiveIndex(prev => prev + 1);
    swiperRef.current?.scrollBy(1);
  };

  const handleSkipBtnPress = () => {
    navigation.push("/get-started");
  };

  const getStartedBtnHandler = () => {
    navigation.push("/get-started");
  };

  return (
    <SafeAreaView className="flex items-center justify-between h-full bg-white">
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[10px] h-[10px] mx-1 bg-gray-200 rounded-full" />
        }
        activeDot={
          <View className="w-[36px] h-[10px] mx-1 bg-orange-400 rounded-full" />
        }
        onIndexChanged={index => setActiveIndex(index)}>
        {onboarding.map(item => {
          return (
            <View
              key={item.id}
              className="flex items-center justify-center p-3">
              <View className="flex items-center justify-center w-full mt-10 flex-column">
                <Text className="mx-3 text-3xl font-bold text-center text-black font-JakartaSemiBold">
                  {item.title}
                </Text>
                <Text className="text-lg font-Jakarta text-center text-[#858585] mt-7 mx-1">
                  {item.description}
                </Text>
              </View>
            </View>
          );
        })}
      </Swiper>
      <View className="border-t-gray-100 border-t-[1px] flex flex-row justify-around items-center max-h-fit w-full mb-2 p-3">
        {!isLastSlide ? (
          <Fragment>
            <CustomBtn
              title="Skip"
              className="w-[47%] bg-[#faf2ea]"
              textClassName="text-orange-400"
              onPress={handleSkipBtnPress}
            />
            <CustomBtn
              title="Continue"
              className="w-[47%] bg-orange-400"
              onPress={handleContinueBtnPress}
            />
          </Fragment>
        ) : (
          <CustomBtn title="Let's Get Started" onPress={getStartedBtnHandler} />
        )}
      </View>
    </SafeAreaView>
  );
}