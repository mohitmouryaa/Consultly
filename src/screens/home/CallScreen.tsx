import { useEffect } from "react";
import {
  CallingState,
  StreamCall,
  CallContent,
} from "@stream-io/video-react-native-sdk";
import { StyleSheet, Text, View } from "react-native";
import { useSetCall } from "../../hooks/useSetCall";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../../store";
import { setCallLoading, setCallModal } from "../../../store/slices/chatSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CallScreen() {
  const dispatch = useAppDispatch();
  const call = useSetCall();
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    if (!call) {
      return;
    }

    call
      .join({ create: true })
      .then(() => {
        dispatch(setCallModal(false));
        dispatch(setCallLoading(false));
      })
      .catch(error => {
        console.error("Error joining the call:", error);
      });

    return () => {
      if (call.state.callingState !== CallingState.LEFT) {
        call.leave().catch(error => {
          console.error("Error leaving the call:", error);
        });
      }
    };
  }, [call, dispatch]);

  const goToHomeScreen = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  if (!call) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Joining call...</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <SafeAreaView style={styles.container}>
        <CallContent onHangupCallHandler={goToHomeScreen} />
      </SafeAreaView>
    </StreamCall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
  },
});
