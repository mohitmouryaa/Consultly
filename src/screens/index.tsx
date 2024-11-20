import React, { memo, useCallback, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { checkFirstLaunch, deleteToken, getToken } from "../lib/secureStore";
import { useAppDispatch, useAppSelector } from "../../store";
import SplashScreen from "./shared/SplashScreen";
import AuthStackScreen from "./auth/AuthStackScreen";
import HomeStackScreen from "./home/HomeStackScreen";
import Welcome from "./auth/Welcome";
import { setIsFirstLaunch, setIsLoggedIn } from "../../store/slices/userSlice";

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
          </>
        )}
      </Stack.Navigator>
    </React.Fragment>
  );
});
