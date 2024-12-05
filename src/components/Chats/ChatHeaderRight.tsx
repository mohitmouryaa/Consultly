import { Alert, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { CALLED_USER } from "../../constants";
import { useAppSelector } from "../../../store";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";
import { useEffect } from "react";

export default function ChatHeaderRight() {
  const user = useAppSelector(({ user }) => user);
  const { members, _id: chatId, socket } = useCurrentChatMember();

  const handleVideoCall = () => {
    if (!user.isPlanActive) {
      Alert.alert("", "Please subscribe to a plan to make a call");
      return;
    }
    socket.emit(CALLED_USER, { caller: user, members, chatId });
  };

  useEffect(() => {
    return () => {
      socket?.off(CALLED_USER);
    };
  }, [socket]);
  return (
    <View className="flex flex-row mx-2.5 justify-end">
      {user.user_type === "user" && (
        <TouchableOpacity className="mx-1 ml-4" onPress={handleVideoCall}>
          <AntDesign name="videocamera" size={20} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}
