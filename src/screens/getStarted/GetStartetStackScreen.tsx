import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../getStarted/Welcome";

const Stack = createNativeStackNavigator();

export default function GetStartedStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName="welcome"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" component={Welcome} />
    </Stack.Navigator>
  );
}
