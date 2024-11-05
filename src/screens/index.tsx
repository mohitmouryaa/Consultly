import React, { useCallback, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { checkFirstLaunch, deleteToken, getToken } from "../lib/secureStore";
import { useAppDispatch, useAppSelector } from "../../store";
import SplashScreen from "./shared/SplashScreen";
import AuthStackScreen from "./auth/AuthStackScreen";
import HomeStackScreen from "./home/HomeStackScreen";
import Welcome from "./auth/Welcome";
import { setIsFirstLaunch } from "../../store/slices/userSlice";

const Stack = createStackNavigator();

export default function StackScreens() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.user._id);
  const isFirstLaunch = useAppSelector(state => state.user.isFirstLaunch);
  const [isReady, setIsReady] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const intializeApp = useCallback(async () => {
    try {
      if (await checkFirstLaunch()) {
        dispatch(setIsFirstLaunch(true));
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
  }, [dispatch]);

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
          <Stack.Screen name="welcome" component={Welcome} />
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
