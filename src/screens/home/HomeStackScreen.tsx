import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Fragment, useLayoutEffect, useMemo, useState } from "react";
import { Dimensions, Text, View, TouchableOpacity } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { tabBarStyle } from "../../constants";
import { createStackNavigator } from "@react-navigation/stack";
import ScreenHeader from "../../components/ScreenHeader";
import Chat from "./Chat";
import Chats from "./Chats";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feed from "./Feed";
import CallHistory from "./CallHistory";
import Profile from "./Profile";
import Plans from "./Plans";

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
              // title: "Chats",
              // // Adding the search icon to the right side of the app bar
              // headerRight: () => (
              //   <View style={{ flexDirection: "row", marginRight: 10 }}>
              //     {/* Search Icon */}
              //     <TouchableOpacity
              //       style={{ marginRight: 15 }} // Add space between icons
              //       onPress={() => {
              //         console.log("Search icon pressed");
              //       }}>
              //       <AntDesign name="search1" size={25} color="#000000" />
              //     </TouchableOpacity>

              //     {/* Bell Icon (or any other icon) */}
              //     <TouchableOpacity
              //       onPress={() => {
              //         console.log("Dots icon pressed");
              //       }}>
              //       <AntDesign name="ellipsis1" size={25} color="#00000" />
              //     </TouchableOpacity>
              //   </View>
              // ),
              tabBarIcon: ({ color, focused }) => (
                // <TabIcon color={color} name="Chats" focused={focused} />
                <AntDesign name={"wechat"} size={25} color={color} />
              ),
              headerShown: false,
            };
          }}
          component={ChatsStackScreen}
          initialParams={{ tabBarHeight }}></Tab.Screen>
        <Tab.Screen
          name="Call History"
          options={() => {
            return {
              title: "Call History",
              headerStyle: {
                //backgroundColor: "#6200EE", // Background color of the app bar
              },
              tabBarIcon: ({ color, focused }) => (
                // <TabIcon color={color} name="Chats" focused={focused} />
                <AntDesign name={"phone"} size={25} color={color} />
              ),
              //headerShown: false,
            };
          }}
          component={CallHistory}
          initialParams={{ tabBarHeight }}></Tab.Screen>
        <Tab.Screen
          name="Plans"
          options={() => {
            return {
              title: "Plans",
              tabBarIcon: ({ color, focused }) => (
                // <TabIcon color={color} name="Chats" focused={focused} />
                <AntDesign name={"solution1"} size={25} color={color} />
              ),
              //headerShown: false,
            };
          }}
          component={Plans}
          initialParams={{ tabBarHeight }}></Tab.Screen>
        <Tab.Screen
          name="Profile"
          options={() => {
            return {
              title: "Profile",
              tabBarIcon: ({ color, focused }) => (
                // <TabIcon color={color} name="Chats" focused={focused} />
                <AntDesign name={"user"} size={25} color={color} />
              ),
              //headerShown: false,
            };
          }}
          component={Profile}
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
        // options={{
        //   headerShown: false,
        //   //header: () => <ScreenHeader title="Chats" navigation={navigation} />,
        // }}
        options={() => {
          return {
            title: "Chats",
            // Adding the search icon to the right side of the app bar
            headerRight: () => (
              <View style={{ flexDirection: "row", marginRight: 10 }}>
                {/* Search Icon */}
                <TouchableOpacity
                  style={{ marginRight: 15 }} // Add space between icons
                  onPress={() => {
                    console.log("Search icon pressed");
                  }}>
                  <AntDesign name="search1" size={25} color="#000000" />
                </TouchableOpacity>

                {/* Bell Icon (or any other icon) */}
                <TouchableOpacity
                  onPress={() => {
                    console.log("Dots icon pressed");
                  }}>
                  <AntDesign name="ellipsis1" size={25} color="#00000" />
                </TouchableOpacity>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
              // <TabIcon color={color} name="Chats" focused={focused} />
              <AntDesign name={"wechat"} size={25} color={color} />
            ),
            //headerShown: false,
          };
        }}
      />
      <ChatsStack.Screen
        name="chat"
        component={Chat}
        //options={{ headerShown: false }}
        initialParams={{ tabBarHeight: route.params.tabBarHeight }}
        options={{ tabBarStyle: { display: "none" }, headerShown: false }} // Hides the tab bar on ScreenA1
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
