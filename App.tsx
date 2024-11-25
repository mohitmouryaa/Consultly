import { NavigationContainer } from "@react-navigation/native";
import StackScreens from "./src/screens";
import "./global.css";
import Providers from "./src/providers";

export default function App() {
  return (
    <Providers>
      <NavigationContainer>
        <StackScreens />
      </NavigationContainer>
    </Providers>
  );
}
