import React, { memo } from "react";
import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

const InputField = ({
  label,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  leftIconStyle,
  rightIconStyle,
  placeholder,
  rightIconPress,
  ...props
}: InputFieldProps) => {
  const handleRightIconPress = () => {
    if (rightIconPress) {
      rightIconPress();
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full my-2">
          <Text className={`text-base font-semibold mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-xl border border-neutral-100 focus:border-primary-500  ${containerStyle}`}>
            {leftIcon && (
              <Image
                source={leftIcon}
                className={`w-6 h-6 ml-4 ${leftIconStyle}`}
              />
            )}
            <TextInput
              className={`rounded-full p-4 font-semibold text-[15px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              placeholder={placeholder}
              textContentType={props.textContentType as any}
              {...props}
              autoCapitalize="none"
            />
            {rightIcon && (
              <TouchableWithoutFeedback onPress={handleRightIconPress}>
                <Image
                  source={rightIcon}
                  className={`w-6 h-6 ml-2 mr-3 ${rightIconStyle}`}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default memo(InputField);
