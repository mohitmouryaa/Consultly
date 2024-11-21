import React, { useEffect } from "react";
import "./global.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackScreens from "./src/screens";
import { SocketProvider } from "./src/providers/socketProvider";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBvjneO5921EnhyBDJRjB8sRZDP1XIX7As",
  // authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "consulty-ccf9c",
  // storageBucket: "consulty-ccf9c.firebasestorage.app",
  messagingSenderId: "740680676218",
  appId: "1:740680676218:android:3cc26b2162a44b944b5cc3",
};

export default function App() {
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log("Firebase has been initialized successfully.");
    } else {
      firebase.app(); // if already initialized, use that one
      console.log("Firebase was already initialized.");
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <SocketProvider>
          <NavigationContainer>
            <StackScreens />
          </NavigationContainer>
        </SocketProvider>
      </PersistGate>
    </Provider>
  );
}
