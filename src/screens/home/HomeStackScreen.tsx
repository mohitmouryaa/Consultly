import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Fragment, useMemo } from "react";
import { tabBarStyle } from "../../constants";
import CallHistory from "./CallHistory";
import Profile from "./Profile";
import Plans from "./Plans";
import {
  CallHistoryTabBarIcon,
  ChatsTabBarIcon,
  PlansTabBarIcon,
  ProfileTabBarIcon,
} from "../../components/HomeStackScreenIcons";
import ChatsStackScreen from "./ChatsStackScreen";
import StreamClientProvider from "../../providers/streamClientProvider";
import { TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useAppDispatch } from "../../../store";
import { resetState } from "../../../store/actions/resetState";

const Tab = createBottomTabNavigator();

const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(resetState());
  };

  return (
    <TouchableOpacity className="ml-4 mr-4" onPress={logoutHandler}>
      <AntDesign name="logout" size={25} color="#000000" />
    </TouchableOpacity>
  );
};

export default function HomeTabNavigator() {
  const tabBarOptions = useMemo(
    () => ({
      ...tabBarStyle(),
    }),
    [],
  );

  return (
    <Fragment>
      <StreamClientProvider>
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
              headerRight: LogoutButton,
            }}
            component={Profile}
          />
        </Tab.Navigator>
      </StreamClientProvider>
    </Fragment>
  );
}
