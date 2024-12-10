import { Alert, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { CALL_PICKED, CALL_REJECTED, CALLED_USER } from "../../constants";
import { useAppSelector } from "../../../store";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";
import { useEffect, useState } from "react";
import CallModal from "../CallModal";

type CallPickedProps = {
  user: { _id: string };
  chatId: string;
  callerId: string;
};

export default function ChatHeaderRight() {
  const [showModal, setShowModal] = useState(false);
  const user = useAppSelector(state => state.user);
  const isInternetConnected = useAppSelector(
    state => state.misc.isInternetConnected,
  );
  const { name, members, _id: chatId, socket, avatar } = useCurrentChatMember();

  const handleVideoCall = () => {
    if (!isInternetConnected) {
      Alert.alert("", "Please check your internet connection");
      return;
    }
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
    socket?.on(
      CALL_PICKED,
      ({ user: _user, chatId: _chatId, callerId }: CallPickedProps) => {
        if (_user._id !== user._id && _chatId !== chatId) return;
        setShowModal(false);
        Alert.alert("", "Call Picked By User");
        console.log(callerId, "callerId");
      },
    );

    return () => {
      socket?.off(CALLED_USER);
      socket?.off(CALL_REJECTED);
    };
  }, [socket, chatId, user._id]);
  return (
    <View className="flex flex-row mx-2.5 justify-end">
      {user.user_type === "user" && (
        <TouchableOpacity
          className={`mx-1 ml-4 ${isInternetConnected ? "" : "opacity-50"}`}
          onPress={handleVideoCall}
          disabled={!isInternetConnected}>
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
