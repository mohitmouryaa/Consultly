import { Alert, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { CALL_REJECTED, CALLED_USER } from "../../constants";
import { useAppSelector } from "../../../store";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";
import { useEffect, useState } from "react";
import CallModal from "../CallModal";

export default function ChatHeaderRight() {
  const [showModal, setShowModal] = useState(false);
  const user = useAppSelector(state => state.user);
  const { name, members, _id: chatId, socket, avatar } = useCurrentChatMember();

  const handleVideoCall = () => {
    // if (!user.isPlanActive) {
    //   Alert.alert("", "Please subscribe to a plan to make a call");
    //   return;
    // }
    socket?.emit(CALLED_USER, { caller: user, members, chatId });
    setShowModal(true);
  };

  useEffect(() => {
    socket?.on(CALL_REJECTED, ({ chatId: callerId }: { chatId: string }) => {
      if (callerId === chatId) {
        setShowModal(false);
        Alert.alert("", "Call Rejected By User");
      }
    });
    return () => {
      socket?.off(CALLED_USER);
      socket?.off(CALL_REJECTED);
    };
  }, [socket, chatId]);
  return (
    <View className="flex flex-row mx-2.5 justify-end">
      {user.user_type === "user" && (
        <TouchableOpacity className="mx-1 ml-4" onPress={handleVideoCall}>
          <AntDesign name="videocamera" size={20} color="black" />
        </TouchableOpacity>
      )}
      {showModal && (
        <CallModal
          name={name}
          avatar={avatar?.url || ""}
          members={members}
          socket={socket}
          setShowModal={setShowModal}
        />
      )}
    </View>
  );
}
