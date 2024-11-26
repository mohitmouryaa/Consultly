import { Provider } from "react-redux";
import { SocketProvider } from "./socketProvider";
import { persistor, store } from "../../store";
import { PersistGate } from "redux-persist/integration/react";
import { Text } from "react-native";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <SocketProvider>{children}</SocketProvider>
      </PersistGate>
    </Provider>
  );
}
