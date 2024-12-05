import { NavigationContainer } from "@react-navigation/native";
import StackScreens from "./src/screens";
import "./global.css";
import Providers from "./src/providers";
import CallModal from "./src/components/CallModal";

export default function App() {
  return (
    <Providers>
      <CallModal />
      <NavigationContainer>
        <StackScreens />
      </NavigationContainer>
    </Providers>
  );
}
