import React, { useEffect } from "react";
import {
  CallingState,
  StreamCall,
  CallContent,
} from "@stream-io/video-react-native-sdk";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { StyleSheet, Text, View, Platform } from "react-native";
import { useSetCall } from "../../hooks/useSetCall";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const callId = "test1";

export default function CallScreen() {
  const call = useSetCall({ meetingId: callId });
  const navigation = useNavigation<StackNavigationProp<any>>();

  // const requestPermissions = async () => {
  //   try {
  //     if (Platform.OS === "android") {
  //       const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
  //       const microphonePermission = await request(
  //         PERMISSIONS.ANDROID.RECORD_AUDIO,
  //       );

  //       if (
  //         cameraPermission !== RESULTS.GRANTED ||
  //         microphonePermission !== RESULTS.GRANTED
  //       ) {
  //         console.error("Permissions not granted for camera or microphone.");
  //         return false;
  //       }
  //     } else if (Platform.OS === "ios") {
  //       const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
  //       const microphonePermission = await request(PERMISSIONS.IOS.MICROPHONE);

  //       if (
  //         cameraPermission !== RESULTS.GRANTED ||
  //         microphonePermission !== RESULTS.GRANTED
  //       ) {
  //         console.error("Permissions not granted for camera or microphone.");
  //         return false;
  //       }
  //     }
  //     return true;
  //   } catch (error) {
  //     console.error("Error requesting permissions:", error);
  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   const joinCall = async () => {
  //     const hasPermissions = await requestPermissions();

  //     if (!hasPermissions || !call) {
  //       return;
  //     }

  //     try {
  //       await call.join({ create: true });
  //     } catch (error) {
  //       console.error("Error joining the call:", error);
  //     }
  //   };

  //   joinCall();

  //   return () => {
  //     // Ensure call is not null or undefined before calling leave
  //     if (call && call.state.callingState !== CallingState.LEFT) {
  //       call.leave().catch(error => {
  //         console.error("Error leaving the call:", error);
  //       });
  //     }
  //   };
  // }, [call]);

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
