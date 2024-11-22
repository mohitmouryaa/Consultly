import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Fragment, useMemo } from "react";
import { tabBarStyle } from "../../constants";
import { createStackNavigator } from "@react-navigation/stack";
import Chat from "./Chat";
import Chats from "./Chats";
import CallHistory from "./CallHistory";
import Profile from "./Profile";
import Plans from "./Plans";
import {
  CallHistoryTabBarIcon,
  ChatsTabBarIcon,
  PlansTabBarIcon,
  ProfileTabBarIcon,
} from "../../components/HomeStackScreenIcons";
import ChatsRightHeader from "./ChatsRightHeader";
import ChatHeaderTitle from "../../components/Chats/ChatHeaderTitle";
import ChatHeaderRight from "../../components/Chats/ChatHeaderRight";

const Tab = createBottomTabNavigator();
const ChatsStack = createStackNavigator();

export default function HomeTabNavigator() {
  const tabBarOptions = useMemo(
    () => ({
      ...tabBarStyle(),
    }),
    [],
  );

  return (
    <Fragment>
      <Tab.Navigator screenOptions={tabBarOptions}>
        <Tab.Screen
          name="chatsStackScreen"
          options={{
            tabBarIcon: ChatsTabBarIcon,
            headerShown: false,
          }}
          component={ChatsStackScreen}
        />
        <Tab.Screen
          name="Call History"
          options={{
            title: "Call History",
            tabBarIcon: CallHistoryTabBarIcon,
          }}
          component={CallHistory}
        />
        <Tab.Screen
          name="Plans"
          options={{
            title: "Plans",
            tabBarIcon: PlansTabBarIcon,
          }}
          component={Plans}
        />
        <Tab.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ProfileTabBarIcon,
          }}
          component={Profile}
        />
      </Tab.Navigator>
    </Fragment>
  );
}

function ChatsStackScreen({ route }: any) {
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
    </ChatsStack.Navigator>
  );
}
