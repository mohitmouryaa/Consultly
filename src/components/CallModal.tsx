import { memo, useCallback, useEffect } from "react";
import { Alert, Image, Modal, Pressable, Text, View } from "react-native";
import { type Socket } from "socket.io-client";
import {
  CALL_CANCELLED,
  CALL_PICKED,
  images,
  UPDATE_CALLER,
} from "../constants";
import { useAppDispatch, useAppSelector } from "../../store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { startCall } from "../../store/slices/chatSlice";

interface ModalProps {
  user: {
    _id?: string;
    sql_id?: string;
    user_type?: string;
  };
  chatId: string;
  name: string;
  avatar: string;
  members: string[];
  socket: Socket | null;
  setShowModal: (show: boolean) => void;
}
export default memo(function CallModal({
  user,
  chatId,
  name,
  avatar,
  members,
  socket,
  setShowModal,
}: ModalProps) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const callerSqlId = useAppSelector(state => state.chat.caller.sql_id);

  const callPickedHandler = useCallback(
    async (callerId: string) => {
      try {
        const userId = user.sql_id!;
        const counsellorId = callerSqlId!;
        // if (!userId || !counsellorId) return;
        // const res = await dispatch(
        //   startCall({ roomId: chatId, counsellorId, userId }),
        // );
        // if (res.meta.requestStatus === "rejected") throw new Error();
        // socket?.emit(UPDATE_CALLER, {
        //   caller: { ...user },
        //   id: "test1",
        // });
        navigation.navigate("call");
      } catch {
        Alert.alert("Error", "Failed to start call");
      }
    },
    [callerSqlId, chatId, dispatch, navigation, socket, user],
  );

  const handleCallCancel = () => {
    socket?.emit(CALL_CANCELLED, { members });
    setShowModal(false);
  };

  useEffect(() => {
    socket?.on(CALL_PICKED, ({ user: _user, chatId: _chatId, callerId }) => {
      if (_user._id !== user._id && _chatId !== chatId) return;
      setShowModal(false);
      callPickedHandler(callerId);
    });
    return () => {
      socket?.off(CALL_PICKED);
      socket?.off(CALL_CANCELLED);
    };
  }, [socket, setShowModal, user._id, chatId, callPickedHandler]);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={handleCallCancel}>
      <View className="absolute inset-0 flex items-center justify-center bg-black/50">
        <View className="w-[90%] max-w-md mx-4 bg-white rounded-3xl p-6 items-center shadow-xl">
          {/* Avatar Container */}
          <View className="w-24 h-24 mb-4 overflow-hidden border-2 border-gray-100 rounded-full shadow-sm">
            <Image
              source={avatar ? { uri: avatar } : images.profilePic}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Name and Status */}
          <View className="items-center mb-6 space-y-2">
            <Text className="text-xl font-bold text-gray-800">{name}</Text>
            <Text className="text-sm text-gray-500">Calling...</Text>
          </View>

          {/* Cancel Button */}
          <Pressable
            className="w-full px-6 py-3 bg-red-500 shadow-sm active:bg-red-600 rounded-xl"
            onPress={handleCallCancel}>
            <Text className="text-base font-semibold text-center text-white">
              Cancel Call
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});
