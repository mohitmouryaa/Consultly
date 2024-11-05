import React from "react";
import "./global.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackScreens from "./src/screens";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NavigationContainer>
          <StackScreens />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
