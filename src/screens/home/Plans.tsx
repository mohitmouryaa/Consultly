import React, { memo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveSubscription from "../../components/ActiveSubscription";
import { FlatList } from "react-native-gesture-handler";
import { useGetPlansQuery, useGetUserPlanQuery } from "../../../store/api";
import { useAppSelector } from "../../../store";

export default memo(function Plans() {
  const id = useAppSelector(state => state.user._id);
  const { data: plans } = useGetPlansQuery(undefined);
  const { data: userPlan } = useGetUserPlanQuery({ userId: id });
  console.log("plans", userPlan);

  const renderItem = ({ item }: { item: any }) => (
    <ActiveSubscription
      planName={item.name}
      expiryDate={item.updatedAt}
      price={item.price}
      minutes={item.minutes}
      validity={item.validity_days}
    />
  );

  return (
    <SafeAreaView className="flex-col justify-between flex-1 w-full h-full bg-white">
      <FlatList
        className="mx-5"
        data={plans}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          Object.keys(userPlan || {}).length ? (
            <View>
              <Text className="text-xl font-bold mb-2.5">
                Your Active Subscription
              </Text>
              <ActiveSubscription
                planName={"Trial Plan"}
                expiryDate="Expires on 12-07-2024"
                price={"49.99"}
                minutes={"25/25"}
                validity={"10"}
              />
              <Text className="text-xl font-bold mb-2.5 mt-5">Plans</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
});
