import { memo, useCallback, useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../../constants";
import { useSocket } from "../../providers/socketProvider";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../store";
import { chatApi } from "../../../store/api";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";
import AntIcon from "react-native-vector-icons/AntDesign";
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
import httpClient from "../../lib/httpClient";
import { AxiosError } from "axios";

export default memo(function SendMsgInput() {
  const dispatch = useDispatch();
  // @ts-ignore
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userId = useAppSelector(state => state.user._id);
  const { _id: chatId, members } = useCurrentChatMember();
  const { socket } = useSocket();
  const textMsgRef = useRef<string>("");
  const [refresh, setRefresh] = useState(1); // USED TO REFRESH THE INPUT FIELD

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
        const selectedImage = response.assets[0]; // Get the first image
        sendImage(selectedImage);
      }
    });
  };

  const sendImage = async (selectedImage: Asset | null) => {
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append("chatId", chatId);
        const image = {
          uri: selectedImage.uri,
          name: selectedImage.fileName,
          type: selectedImage.type,
        };

        formData.append("files", image);
      }
      const response = await httpClient.post("/chat/message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        console.log("Response -- ", response.data);
      }
    } catch (error) {
      const errMessage = (error as AxiosError<{ message: string }>)?.response
        ?.data?.message;
      Alert.alert(
        "",
        errMessage || "An error occurred. Please try again later.",
      );
    } finally {
    }
  };

  const handleTyping = useCallback(
    (text: string) => {
      textMsgRef.current = text;
      if (!typingTimeoutRef.current) {
        socket?.emit(START_TYPING, { chatId, members });
      } else {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit(STOP_TYPING, { chatId, members });
        typingTimeoutRef.current = null;
      }, 500); // AFTER 500ms OF NO TYPING, STOP TYPING
    },
    [chatId, members, socket],
  );

  const handleSendBtn = useCallback(() => {
    if (textMsgRef.current.trim() === "") return;
    socket?.emit(NEW_MESSAGE, { chatId, members, message: textMsgRef.current });
    const newMessage = {
      content: textMsgRef.current,
      sender: { _id: userId },
      createdAt: new Date().toISOString(),
    };
    // UPDATE THE CACHED MESSAGES RETURN FROM THE API
    dispatch(
      chatApi.util.updateQueryData(
        "getChatById",
        { chatId, page: 1 },
        (draft: any) => {
          draft.messages.push(newMessage);
        },
      ) as any,
    );
    setRefresh(prev => prev + 1);
  }, [chatId, dispatch, members, socket, userId]);

  return (
    <View className="flex flex-row items-center p-2.5 border-t-[1px] bg-[#fff] border-[##ddd]">
      <TextInput
        className="flex flex-1 h-10 border-[#ccc] border-[1px] rounded-3xl px-2.5 bg-[#f0f0f0]"
        placeholder="Type a message..."
        onChangeText={handleTyping}
        key={refresh?.toString()}
      />
      <TouchableOpacity
        className="ml-2.5 bg-[#FFA001] px-2 py-3.5 rounded-2xl"
        onPress={pickImage}>
        {/* Replace Text with an image icon */}
        <AntIcon name="picture" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        className="ml-2.5 bg-[#FFA001] px-2 py-3.5 rounded-2xl"
        onPress={handleSendBtn}>
        <Text className="text-base text-[#fff]">Send</Text>
      </TouchableOpacity>
    </View>
  );
});
