import React, { memo } from "react";
import { Modal, Text, Pressable, View, Image, Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  setCallerDetails,
  setCallReceiveModal,
  startCall,
} from "../../store/slices/chatSlice";
import { useSocket } from "../providers/socketProvider";
import {
  CALL_PICKED,
  CALL_REJECTED,
  images,
  UPDATE_CALLER,
} from "../constants";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AntDesign from "react-native-vector-icons/AntDesign";

export default memo(function ReceiveCallModal() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { socket } = useSocket();
  const modalVisible = useAppSelector(state => state.chat.openCallReceiveModal);
  const caller = useAppSelector(state => state.chat.caller);
  const user = useAppSelector(state => state.user);

  const handleCallAccept = async () => {
    dispatch(setCallReceiveModal(false));
    const { callerId, chatId, sql_id } = caller;
    if (!callerId || !chatId || !sql_id || !user.sql_id) return;
    socket?.emit(CALL_PICKED, { user: { _id: user._id }, callerId, chatId });
    try {
      // const { payload, meta } = await dispatch(
      //   startCall({
      //     roomId: chatId,
      //     counsellorId: user.sql_id,
      //     userId: sql_id,
      //   }),
      // );
      // if (meta.requestStatus === "rejected") throw new Error();
      socket?.emit(UPDATE_CALLER, { caller, id: "test1" });
      navigation.navigate("call");
    } catch {
      Alert.alert("Error", "Failed to start call");
    }
  };

  const handleCallReject = () => {
    const { callerId, chatId } = caller;
    socket?.emit(CALL_REJECTED, { callerId, chatId });
    dispatch(setCallerDetails({}));
    dispatch(setCallReceiveModal(false));
  };

  if (!caller || Object.values(caller).length === 0) return null;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCallReject}>
      <View className="absolute inset-0 flex items-center justify-center bg-black/50">
        <View className="w-[90%] max-w-md mx-4 bg-white rounded-3xl p-6 items-center shadow-xl">
          {/* Avatar */}
          <View className="w-24 h-24 mb-4 overflow-hidden border-4 border-gray-100 rounded-full shadow-md">
            <Image
              source={
                caller?.avatar?.url
                  ? { uri: caller.avatar.url }
                  : images.profilePic
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Caller Info */}
          <View className="items-center mb-8 space-y-2">
            <Text className="text-xl font-bold text-gray-800">
              {caller.name}
            </Text>
            <Text className="text-sm text-gray-500">
              Incoming video call...
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-center w-full space-x-6">
            {/* Accept Button */}
            <Pressable
              onPress={handleCallAccept}
              className="flex-row items-center justify-center flex-1 px-6 py-3 bg-green-500 rounded-xl active:bg-green-600">
              <AntDesign
                name="videocamera"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-base font-semibold text-white">Accept</Text>
            </Pressable>

            {/* Reject Button */}
            <Pressable
              onPress={handleCallReject}
              className="flex-row items-center justify-center flex-1 px-6 py-3 bg-red-500 rounded-xl active:bg-red-600">
              <AntDesign
                name="close"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-base font-semibold text-white">
                Decline
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});
