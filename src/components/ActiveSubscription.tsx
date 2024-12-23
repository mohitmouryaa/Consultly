import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign"; // Import AntDesign icons
import { convertDate } from "../lib/utils";

interface ActiveSubscriptionProps {
  planName: string;
  expiryDate: Date;
  price: number;
  minutes: number;
  validity: number;
  buy: boolean;
  onPress: () => void;
}

const ActiveSubscription: React.FC<ActiveSubscriptionProps> = ({
  planName,
  expiryDate,
  price,
  minutes,
  validity,
  buy,
  onPress,
}) => {
  return (
    <View className="bg-[#fff] p-4 rounded-lg elevation-md shadow-black shadow-opacity-20 shadow-radius-4 my-2 border border-[#FFA001] border-opacity-100">
      {/* First Row: Left-aligned Plan and Right-aligned Expiry Date */}
      <View className="flex flex-row justify-between mb-2.5">
        <Text className="text-base font-semibold">{planName}</Text>
        <Text className="text-base font-semibold">
          Expiry: {convertDate(expiryDate)}
        </Text>
      </View>

      {/* Second Row: Price in Bold */}
      <Text className="text-lg font-bold text-left">${price}</Text>
      <View className="bg-[#FFA001] my-2.5 h-px" />
      {/* Row with Minutes, Validity, and Buy Button */}
      <View className="flex flex-row items-center px-1.5">
        <View className="flex flex-1">
          <View className="flex flex-row items-center p-1">
            <AntIcon
              name={"checkcircleo"}
              size={24}
              color="#FFA001"
              className="mr-2.5"
            />
            <Text className="text-base text-left">{minutes} minutes</Text>
          </View>
          <View className="flex flex-row items-center p-1">
            <AntIcon
              name={"checkcircleo"}
              size={24}
              color="#FFA001"
              className="mr-2.5"
            />
            <Text className="text-base text-left">{validity} Days</Text>
          </View>
        </View>
        {/* Buy Button */}
        {buy && (
          <TouchableOpacity
            className="bg-[#FFA001] py-2 px-3 rounded-lg flex justify-center items-center"
            onPress={onPress}>
            <Text className="text-[#fff] font-bold">Buy</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(ActiveSubscription);
