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
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useAppDispatch, useAppSelector } from "../../../store";
import { resetState } from "../../../store/actions/resetState";
import { Text } from "react-native-gesture-handler";

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

  const { isLoading, loadingMessage } = useAppSelector(state => ({
    isLoading: state.misc.isLoading,
    loadingMessage: state.misc.loadingMessage,
  }));

  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10,
          }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            {loadingMessage || "Loading..."}
          </Text>
        </View>
      )}
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
    </View>
  );
}
