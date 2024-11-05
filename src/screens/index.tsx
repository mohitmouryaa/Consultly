import React, { useCallback, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { checkFirstLaunch, deleteToken, getToken } from "../lib/secureStore";
import { useAppSelector } from "../../store";
import SplashScreen from "./shared/SplashScreen";
import GetStartedStackScreen from "./getStarted/GetStartetStackScreen";
import AuthStackScreen from "./auth/AuthStackScreen";
import HomeStackScreen from "./home/HomeStackScreen";

const Stack = createNativeStackNavigator();

export default function StackScreens() {
  const userId = useAppSelector(state => state.user._id);
  const [isReady, setIsReady] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const intializeApp = useCallback(async () => {
    try {
      if (await checkFirstLaunch()) {
        setIsFirstLaunch(true);
      } else if (await getToken()) {
        if (!userId) {
          deleteToken();
        } else {
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setIsReady(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    intializeApp();
  }, [intializeApp]);

  if (isReady) {
    return <SplashScreen />;
  }
  return (
    <React.Fragment>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="launch" component={GetStartedStackScreen} />
        ) : !isLoggedIn ? (
          <Stack.Screen name="auth" component={AuthStackScreen} />
        ) : (
          <>
            <Stack.Screen name="home" component={HomeStackScreen} />
          </>
        )}
      </Stack.Navigator>
    </React.Fragment>
  );
}
