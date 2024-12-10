import { Alert, TouchableOpacity, View } from "react-native";
import { CALL_REJECTED, CALLED_USER } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useEffect, useState } from "react";
import { setCallerDetails } from "../../../store/slices/chatSlice";
import CallModal from "../CallModal";
import useCurrentChatMember from "../../hooks/useCurrentChatMember";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function ChatHeaderRight() {
  const dispatch = useAppDispatch();
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
    dispatch(setCallerDetails({ caller: user, members, chatId }));
    setShowModal(true);
  };

  useEffect(() => {
    socket?.on(
      CALL_REJECTED,
      ({ chatId: callerChatId }: { chatId: string }) => {
        if (callerChatId === chatId) {
          setShowModal(false);
          Alert.alert("", "Call Rejected By User");
          dispatch(setCallerDetails({}));
        }
      },
    );

    return () => {
      socket?.off(CALLED_USER);
      socket?.off(CALL_REJECTED);
    };
  }, [socket, chatId, user._id, dispatch]);
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
          chatId={chatId}
          user={user}
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
