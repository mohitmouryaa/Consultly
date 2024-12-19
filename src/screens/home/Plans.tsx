import React, { memo, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveSubscription from "../../components/ActiveSubscription";
import { FlatList } from "react-native-gesture-handler";
import { useGetPlansQuery, useGetUserPlanQuery } from "../../../store/api";
import { useAppSelector } from "../../../store";
import { initiatePayment } from "../../lib/utils";
import httpClient from "../../lib/httpClient";
import { SQL_SERVER_URL } from "@env";

export default memo(function Plans() {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { _id: id, name, email } = useAppSelector(state => state.user);
  const { data: plans, refetch: refetchPlans } = useGetPlansQuery(undefined);
  const { data: userPlan, refetch: refetchUserPlan } = useGetUserPlanQuery(
    {
      userId: id,
    },
    { skip: !id },
  );

  const handlePurchase = async (plan: any) => {
    try {
      // Prevent multiple clicks
      if (isProcessingPayment) return;
      setIsProcessingPayment(true);

      // Create order on backend
      const orderResponse = await httpClient.post(
        `${SQL_SERVER_URL}/api/createPayment`,
        {
          amount: plan.price,
        },
      );

      if (!orderResponse.data) {
        throw new Error("Failed to create order");
      }

      // Initiate payment
      const { success, data, error } = await initiatePayment({
        amount: plan.price,
        orderId: orderResponse.data.id,
        email: email!,
        name: name!,
        description: "Plan Purchase",
      });

      if (success && data) {
        // Verify payment on backend
        const verificationResponse = await httpClient.post(
          `${SQL_SERVER_URL}/api/userPlan/` + id,
          {
            plan_id: plan.id,
            payment_id: data.razorpay_payment_id,
            signature: data.razorpay_signature,
            order_id: orderResponse.data.id,
          },
        );

        if (verificationResponse.data.success) {
          Alert.alert("Success", "Payment successful!");
          // Refresh plans and user plan
          await Promise.all([refetchPlans(), refetchUserPlan()]);
        } else {
          throw new Error("Payment verification failed");
        }
      } else {
        throw new Error((error as any)?.description || "Payment failed");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsProcessingPayment(false);
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
                expiryDate="12-07-2024"
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
