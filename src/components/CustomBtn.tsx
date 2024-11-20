import React, { memo } from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

export default memo(function CustomBtn({
  onPress,
  title,
  className = "bg-orange-400",
  textClassName = "text-white",
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      {...props}
      className={` p-2 h-14 w-full justify-center items-center rounded-2xl ${className}`}
      // className={`w-full h-14 mb-3 rounded-2xl p-3 flex flex-1 mx-2 justify-center items-center ${className}`}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={`text-lg font-bold ${textClassName}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});
