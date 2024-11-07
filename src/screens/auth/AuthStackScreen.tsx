import React from "react";
import LoginScreen from "./Login";
import { createStackNavigator } from "@react-navigation/stack";
import GetStarted from "./GetStarted";
import RegisterScreen from "./Register";

const AuthStack = createStackNavigator();

export default function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      initialRouteName="get-started"
      screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="get-started" component={GetStarted} />
      <AuthStack.Screen name="login" component={LoginScreen} />
      <AuthStack.Screen name="register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}
