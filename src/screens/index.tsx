import React, { memo, useCallback, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert, Platform } from "react-native";
import { checkFirstLaunch, deleteToken, getToken } from "../lib/secureStore";
import { useAppDispatch, useAppSelector } from "../../store";
import SplashScreen from "./shared/SplashScreen";
import AuthStackScreen from "./auth/AuthStackScreen";
import HomeStackScreen from "./home/HomeStackScreen";
import Welcome from "./auth/Welcome";
import { setIsFirstLaunch, setIsLoggedIn } from "../../store/slices/userSlice";
import messaging from "@react-native-firebase/messaging";

const Stack = createStackNavigator();

export default memo(function StackScreens() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.user._id);
  const isFirstLaunch = useAppSelector(state => state.user.isFirstLaunch);
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);
  const [isReady, setIsReady] = useState(true);

  const intializeApp = useCallback(async () => {
    const token = await getToken();
    let loginStatus = false;
    try {
      if (!token && (await checkFirstLaunch())) {
        dispatch(setIsFirstLaunch(true));
      } else if (token && !userId) {
        await deleteToken();
      } else if (token && userId) {
        loginStatus = true;
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setIsReady(true);
      dispatch(setIsLoggedIn(loginStatus));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    intializeApp();

    // Request permission for notifications on iOS
    const requestPermission = async () => {
      if (Platform.OS === "ios") {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("FCM permission granted.");
        } else {
          console.log("FCM permission denied.");
        }
      }
    };

    requestPermission();

    // Get the device token for push notifications
    // const getToken = async () => {
    //   const fcmToken = await messaging().getToken();
    //   console.log("FCM Token:", fcmToken);
    // };

    // getToken();

    // Handle messages received in the foreground
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      Alert.alert("New FCM message!", JSON.stringify(remoteMessage));
    });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log("Message handled in the background!", remoteMessage);
    });

    return () => {
      unsubscribeOnMessage(); // Cleanup foreground listener
    };
  }, [intializeApp]);

  if (!isReady) {
    return <SplashScreen />;
  }
  return (
    <React.Fragment>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="welcome" component={Welcome} />
        ) : !isLoggedIn ? (
          <Stack.Screen name="auth" component={AuthStackScreen} />
        ) : (
          <>
            <Stack.Screen name="home" component={HomeStackScreen} />
            {/* <Stack.Screen name="home" component={Home} /> */}
          </>
        )}
      </Stack.Navigator>
    </React.Fragment>
  );
});
