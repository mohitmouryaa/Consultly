import { createStackNavigator } from "@react-navigation/stack";
import { ChatsTabBarIcon } from "../../components/HomeStackScreenIcons";
import Chats from "./Chats";
import Chat from "./Chat";
import ChatsRightHeader from "./ChatsRightHeader";
import ChatHeaderTitle from "../../components/Chats/ChatHeaderTitle";
import ChatHeaderRight from "../../components/Chats/ChatHeaderRight";
import { CallScreen } from "./CallScreen";

const ChatsStack = createStackNavigator();

export default function ChatsStackScreen() {
  return (
    <ChatsStack.Navigator initialRouteName="chats">
      <ChatsStack.Screen
        name="chats"
        component={Chats}
        options={() => {
          return {
            title: "Chats",
            headerRight: ChatsRightHeader,
            tabBarIcon: ChatsTabBarIcon,
          };
        }}
      />
      <ChatsStack.Screen
        name="chat"
        component={Chat}
        options={() => ({
          headerTitle: ChatHeaderTitle,
          headerRight: ChatHeaderRight,
        })}
      />
      <ChatsStack.Screen
        name="call"
        component={CallScreen}
        options={{
          headerShown: false,
        }}
      />
    </ChatsStack.Navigator>
  );
}
