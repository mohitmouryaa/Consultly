import React from "react";
import Feed from "./Feed";
import { createStackNavigator } from "@react-navigation/stack";

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="feed"
      screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="feed" component={Feed} />
    </HomeStack.Navigator>
  );
}
