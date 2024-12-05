import React, { useEffect } from "react";
import {
  CallingState,
  StreamCall,
  CallContent,
} from "@stream-io/video-react-native-sdk";
import { StyleSheet, Text, View } from "react-native";
import { useSetCall } from "../../hooks/useSetCall";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

const callId = "test1";

export default function CallScreen() {
  const call = useSetCall({ meetingId: callId });
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    if (!call) {
      return;
    }

    call.join({ create: true }).catch(error => {
      console.error("Error joining the call:", error);
    });

    return () => {
      if (call.state.callingState !== CallingState.LEFT) {
        call.leave().catch(error => {
          console.error("Error leaving the call:", error);
        });
      }
    };
  }, [call]);

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
      <View style={styles.container}>
        <Text style={styles.text}>Here we will add Video Calling UI</Text>
        <CallContent onHangupCallHandler={goToHomeScreen} />
      </View>
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
