import { AxiosError } from "axios";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "../../../store";
import httpClient from "../../lib/httpClient";
import { setIsLoggedIn, setUser } from "../../../store/slices/userSlice";
import { storeToken } from "../../lib/secureStore";
import { icons } from "../../constants";
import CustomBtn from "../../components/CustomBtn";
import InputField from "../../components/InputField";
import { Link } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type LoginProps = {
  navigation: StackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: LoginProps) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [securePassword, setSecurePassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const showPasswordHandler = () => {
    setSecurePassword((prev: boolean) => !prev);
  };

  const handleSignInBtn = async () => {
    setLoading(true);
    try {
      if (!form.password || !form.username) {
        Alert.alert("", "Please fill in all fields");
        return;
      }
      const response = await httpClient.post("/user/login", { ...form });
      if (response.status === 200) {
        const { token, user } = response.data;
        dispatch(setUser({ ...user, token }));
        await storeToken(token);
        dispatch(setIsLoggedIn(true));
      }
    } catch (error) {
      console.log(error);
      const errMessage = (error as AxiosError<{ message: string }>)?.response
        ?.data?.message;
      Alert.alert(
        "",
        errMessage || "An error occurred. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-col justify-between w-full h-full p-5 bg-white">
      <View className="">
        <TouchableOpacity
          onPress={() => navigation.replace("get-started")}
          disabled={loading}>
          <Image source={icons.backArrowIcon} className="w-7 h-7" />
        </TouchableOpacity>
        <Text className="mt-5 text-3xl font-bold">Welcome Back 👋</Text>
        <Text className="mt-2 text-sm font-light">
          Sign in to Connect with your AI Friends
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          className="max-h-fit"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          onScrollBeginDrag={Keyboard.dismiss}
          contentContainerStyle={styles.scrollView}>
          <InputField
            label="Username"
            textContentType="username"
            placeholder="Username"
            leftIcon={icons.username}
            value={form.username}
            onChangeText={(value: string) =>
              setForm({ ...form, username: value })
            }
            readOnly={loading}
            keyboardType="default"
          />
          <InputField
            label="Password"
            secureTextEntry={securePassword}
            textContentType="password"
            placeholder="Password"
            leftIcon={icons.lock}
            rightIcon={securePassword ? icons.eyeCross : icons.eyeOpen}
            rightIconPress={showPasswordHandler}
            value={form.password}
            onChangeText={(value: string) =>
              setForm({ ...form, password: value })
            }
            readOnly={loading}
          />
          <View className="flex-row items-center justify-between mt-3">
            <Link to={"/login"} className="text-orange-400" disabled={loading}>
              Forgot Password?
            </Link>
            <Text className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                to={"/register"}
                className="text-orange-400"
                disabled={loading}>
                Sign up
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="border-t-gray-100 border-t-[1px] w-full items-center">
        <CustomBtn
          title="Sign in"
          onPress={handleSignInBtn}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
