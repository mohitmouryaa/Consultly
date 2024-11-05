import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Feed from "./Feed";

const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="feed"
      screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="feed" component={Feed} />
    </HomeStack.Navigator>
  );
}
