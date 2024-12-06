import React, { memo } from "react";
import { SafeAreaView, ScrollView, Image, Keyboard } from "react-native";
import UserDetail from "../../components/UserDetail";
import { icons } from "../../constants";
import { useAppSelector } from "../../../store";

export default memo(function Profile() {
  const { name, username, email } = useAppSelector(state => state.user);
  return (
    <SafeAreaView className="flex-col justify-between flex-1 w-full h-full p-5 bg-white ">
      <ScrollView
        className="max-h-fit"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        onScrollEndDrag={Keyboard.dismiss}>
        <Image
          source={icons.profile}
          className="mx-auto my-3 mb-10 border-2 rounded-full w-28 h-28 border-neutral-400 "
        />
        {/* <ActiveSubscription /> */}
        <UserDetail titleName="Name" iconName="user" value={name} />
        <UserDetail titleName="User name" iconName="user" value={username} />
        <UserDetail titleName="Email" iconName="mail" value={email} />
      </ScrollView>
    </SafeAreaView>
  );
});
