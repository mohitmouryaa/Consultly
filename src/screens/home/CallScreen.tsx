import { useCallback, useEffect } from "react";
import {
  CallingState,
  StreamCall,
  CallContent,
} from "@stream-io/video-react-native-sdk";
import { Text, View } from "react-native";
import { useSetCall } from "../../hooks/useSetCall";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  setCallerDetails,
  setCallLoading,
  setCallReceiveModal,
} from "../../../store/slices/chatSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "../../providers/socketProvider";
import { CALL_END } from "../../constants";

export default function CallScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const user = useAppSelector(state => state.user);
  const { socket, onlineUsers } = useSocket();
  const call = useSetCall();
  const { chatId, callerId } = useAppSelector(state => state.chat.caller);

  const onHangupCallHandler = useCallback(async () => {
    dispatch(setCallerDetails({}));
    navigation.canGoBack() && navigation.goBack();
    socket?.emit(CALL_END, {
      callerId,
      memberList: onlineUsers,
      user: user,
      chatId,
    });
  }, [navigation, dispatch, socket, onlineUsers, user, chatId, callerId]);

  useEffect(() => {
    if (!call) {
      return;
    }

    call
      .join({ create: true })
      .then(() => {
        dispatch(setCallReceiveModal(false));
        dispatch(setCallLoading(false));
      })
      .catch(error => {
        console.error("Error joining the call:", error);
      });

    socket?.on(CALL_END, () => {
      onHangupCallHandler();
    });

    return () => {
      if (call.state.callingState !== CallingState.LEFT) {
        call.leave().catch(error => {
          console.error("Error leaving the call:", error);
        });
      }

      socket?.off(CALL_END);
    };
  }, [call, dispatch, socket, onHangupCallHandler]);

  if (!call) {
    return (
      <View className="flex flex-1">
        <Text className="text-xl text-center">Joining call...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <SafeAreaView className="flex flex-1">
        <CallContent onHangupCallHandler={onHangupCallHandler} />
      </SafeAreaView>
    </StreamCall>
  );
}
