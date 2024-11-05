import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Login";

const AuthStack = createNativeStackNavigator();

export default function AuthStackScreen() {
  return (
    <AuthStack.Navigator initialRouteName="welcome">
      <AuthStack.Screen name="login" component={LoginScreen} />
      <AuthStack.Screen name="register" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}
