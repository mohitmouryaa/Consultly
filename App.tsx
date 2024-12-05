import { NavigationContainer } from "@react-navigation/native";
import StackScreens from "./src/screens";
import "./global.css";
import Providers from "./src/providers";
import CallScreenLoader from "./src/components/CallScreenLoader";
import ReceiveCallModal from "./src/components/RecieveCallModal";

export default function App() {
  return (
    <Providers>
      <NavigationContainer>
        <ReceiveCallModal />
        <StackScreens />
        <CallScreenLoader />
      </NavigationContainer>
    </Providers>
  );
}
