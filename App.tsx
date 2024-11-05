import React from "react";
import Welcome from "./src/screens/auth/Welcome";
import "./global.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Text } from "react-native";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <Welcome />;
      </PersistGate>
    </Provider>
  );
}
