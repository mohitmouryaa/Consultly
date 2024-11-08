import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Fragment, useLayoutEffect, useMemo, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { tabBarStyle } from "../../constants";
import { createStackNavigator } from "@react-navigation/stack";
import ScreenHeader from "../../components/ScreenHeader";
import Chat from "./Chat";
import Chats from "./Chats";

const Tab = createBottomTabNavigator();
const ChatsStack = createStackNavigator();

export default function HomeTabNavigator() {
  const [tabBarHeight, setTabBarHeight] = useState(84); // Default height

  useLayoutEffect(() => {
    const { height } = Dimensions.get("screen");
    if (height < 600) {
      setTabBarHeight(56);
    } else if (height < 840) {
      setTabBarHeight(68);
    } else {
      setTabBarHeight(84);
    }
  }, []);

  const tabBarOptions = useMemo(
    () => ({
      ...tabBarStyle(tabBarHeight),
    }),
    [tabBarHeight],
  );

  return (
    <Fragment>
      <Tab.Navigator screenOptions={tabBarOptions}>
        <Tab.Screen
          name="chatsStackScreen"
          options={() => {
            return {
              title: "Chats",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon color={color} name="Chats" focused={focused} />
              ),
              headerShown: false,
            };
          }}
          component={ChatsStackScreen}
          initialParams={{ tabBarHeight }}></Tab.Screen>
      </Tab.Navigator>
    </Fragment>
  );
}

function ChatsStackScreen({ navigation, route }: any) {
  return (
    <ChatsStack.Navigator initialRouteName="chats">
      <ChatsStack.Screen
        name="chats"
        component={Chats}
        options={{
          header: () => <ScreenHeader title="Chats" navigation={navigation} />,
        }}
      />
      <ChatsStack.Screen
        name="chat"
        component={Chat}
        options={{ headerShown: false }}
        initialParams={{ tabBarHeight: route.params.tabBarHeight }}
      />
    </ChatsStack.Navigator>
  );
}

const TabIcon = ({ color, name, focused }: TabIconProps) => {
  return (
    <View className="flex flex-col items-center justify-between gap-2">
      <HomeScreenIcons color={!focused ? "grey" : color} name={name} />
      <Text
        className={`${
          focused ? "font-JakartaSemiBold" : "font-Jakarta"
        } text-xs mr-2 w-full`}
        style={{ color: !focused ? "grey" : color }}>
        {name}
      </Text>
    </View>
  );
};

const HomeScreenIcons = ({ name, color }: { name: string; color: string }) => {
  const size = 30;
  switch (name) {
    case "Home":
      return <Entypo name="home" size={size} color={color} />;
    case "Chats":
      return <Entypo name="message" size={size + 3} color={color} />;
    case "Calls":
      return <FontAwesome name="phone-square" size={size} color={color} />;
    case "Wallet":
      return <FontAwesome6 name="wallet" size={size - 2} color={color} />;
  }
};
