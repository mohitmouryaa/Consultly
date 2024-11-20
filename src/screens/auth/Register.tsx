import React, { memo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch } from "../../../store";
import { AxiosError } from "axios";
import { storeToken } from "../../lib/secureStore";
import { setIsLoggedIn, setUser } from "../../../store/slices/userSlice";
import httpClient from "../../lib/httpClient";
import { icons } from "../../constants";
import InputField from "../../components/InputField";
import CustomBtn from "../../components/CustomBtn";
import { StackNavigationProp } from "@react-navigation/stack";
import { Link } from "@react-navigation/native";
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";

interface SignUpProps {
  navigation: StackNavigationProp<any>;
}

export default memo(function RegisterScreen({ navigation }: SignUpProps) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [securePassword, setSecurePassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<any | null>(null);
  const dispatch = useAppDispatch();

  const showPasswordHandler = () => {
    setSecurePassword((prev: boolean) => !prev);
  };

  const handleSignUpBtn = async () => {
    setLoading(true);
    try {
      if (!form.email || !form.password || !form.name || !form.username) {
        Alert.alert("", "Please fill in all fields");
        return;
      } else if (!file) {
        Alert.alert("", "Please upload a profile picture");
        return;
      }
      const formData = new FormData();
      formData.append("avatar", {
        uri: file.uri,
        name: file.fileName,
        type: file.mimeType,
      });
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("username", form.username);
      formData.append("password", form.password);
      const response = await httpClient.post("/user/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        Alert.alert("", "Account created successfully");
        const { token, user } = response.data;
        dispatch(setUser({ ...user }));
        await storeToken(token);
        dispatch(setIsLoggedIn(true));
      }
    } catch (error) {
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

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setFile(response.assets[0]);
      }
    });
  };

  return (
    <SafeAreaView className="flex-col justify-between flex-1 w-full h-full p-5 bg-white">
      <View className="">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}>
          <Image source={icons.backArrowIcon} className="w-7 h-7" />
        </TouchableOpacity>
        <Text className="mt-5 text-3xl font-JakartaBold">
          Join Friendly Today
        </Text>
        <Text className="mt-2 text-sm font-JakartaLight">
          Create Your Account To Get Started
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <ScrollView
          className="max-h-fit"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          onScrollEndDrag={Keyboard.dismiss}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={file || icons.profile}
              className="mx-auto my-3 border-2 rounded-full w-28 h-28 border-neutral-400"
            />
            <View className="absolute bottom-5 right-32 bg-white rounded-3xl p-[0.5]">
              {/* TODO- PUT PENCIL ICON HERE */}
            </View>
          </TouchableOpacity>
          <InputField
            label="Name"
            textContentType="name"
            placeholder="Name"
            leftIcon={icons.profile}
            leftIconStyle="text-slate-600"
            value={form.name}
            onChangeText={value => setForm({ ...form, name: value })}
            readOnly={loading}
            keyboardType="default"
          />
          <InputField
            label="Username"
            textContentType="username"
            placeholder="Username"
            leftIcon={icons.username}
            value={form.username}
            onChangeText={value => setForm({ ...form, username: value })}
            readOnly={loading}
            keyboardType="default"
          />
          <InputField
            label="Email"
            textContentType="emailAddress"
            placeholder="Email"
            leftIcon={icons.email}
            value={form.email}
            onChangeText={value => setForm({ ...form, email: value })}
            readOnly={loading}
            keyboardType="email-address"
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
            onChangeText={value => setForm({ ...form, password: value })}
            readOnly={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="border-t-gray-100 border-t-[1px] w-full">
        <Text className="my-3 text-base text-center">
          Already have an account?{" "}
          <Link screen={"login"} className="text-orange-400" disabled={loading}>
            Login
          </Link>
        </Text>
        <CustomBtn
          title="Sign up"
          onPress={handleSignUpBtn}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
});
