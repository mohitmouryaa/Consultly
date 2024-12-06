import React, { memo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveSubscription from "../../components/ActiveSubscription";
import { FlatList } from "react-native-gesture-handler";

const data = [
  {
    id: "1",
    planName: "Trial Plan",
    expiryDate: "Expires on 12-07-2024",
    price: "$49.99",
    minutes: "25 minutes",
    validity: "10 Days",
  },
  {
    id: "2",
    planName: "Trial Plan",
    expiryDate: "Expires on 12-07-2024",
    price: "$49.99",
    minutes: "25 minutes",
    validity: "10 Days",
  },
  {
    id: "3",
    planName: "Trial Plan",
    expiryDate: "Expires on 12-07-2024",
    price: "$49.99",
    minutes: "25 minutes",
    validity: "10 Days",
  },
];

export default memo(function Plans() {
  const renderItem = ({ item }: { item: any }) => (
    <ActiveSubscription
      planName={item.name}
      expiryDate={item.expiryDate}
      price={item.price}
      minutes={item.minutes}
      validity={item.validity}
    />
  );

  return (
    <SafeAreaView className="flex-col justify-between flex-1 w-full h-full bg-white">
      <FlatList
        className="mx-5"
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View>
            <Text className="text-xl font-bold mb-2.5">
              Your Active Subscription
            </Text>
            <ActiveSubscription
              planName={"Trial Plan"}
              expiryDate="Expires on 12-07-2024"
              price={"$49.99"}
              minutes={"25/25 minutes"}
              validity={"10 Days"}
            />
            <Text className="text-xl font-bold mb-2.5 mt-5">Plans</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
});
