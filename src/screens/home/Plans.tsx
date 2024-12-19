import React, { memo } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveSubscription from "../../components/ActiveSubscription";
import { FlatList } from "react-native-gesture-handler";
import { useGetPlansQuery, useGetUserPlanQuery } from "../../../store/api";
import { useAppSelector } from "../../../store";
import { initiatePayment } from "../../lib/utils";
import httpClient from "../../lib/httpClient";

export default memo(function Plans() {
  const id = useAppSelector(state => state.user._id);
  const { data: plans } = useGetPlansQuery(undefined);
  const { data: userPlan } = useGetUserPlanQuery({ userId: id });

  const handlePurchase = async (plan: any) => {
    try {
      // First create order on your backend
      const order = httpClient.post('/')

      // Initiate Razorpay payment
      const { success, data, error } = await initiatePayment(
        plan.price,
        order.id,
      );

      if (success && data) {
        const verification = await httpClient.post("/verify-payment", {
          orderId: order.id,
          paymentId: data.razorpay_payment_id,
          signature: data.razorpay_signature,
        });

        if (verification.data.success) {
          Alert.alert("Success", "Payment successful!");
        }
      } else {
        Alert.alert("Error", (error as any)?.description || "Payment failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <ActiveSubscription
      planName={item.name}
      expiryDate={item.updatedAt}
      price={item.price}
      minutes={item.minutes}
      validity={item.validity_days}
      onPress={() => handlePurchase(item)}
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
