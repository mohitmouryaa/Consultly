import React, { memo, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveSubscription from "../../components/ActiveSubscription";
import { FlatList } from "react-native-gesture-handler";
import { useGetPlansQuery, useGetUserPlanQuery } from "../../../store/api";
import { useAppSelector } from "../../../store";
import { initiatePayment } from "../../lib/utils";
import httpClient from "../../lib/httpClient";
import { SQL_SERVER_URL } from "@env";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../../store/slices/miscSlice";

export default memo(function Plans() {
  const dispatch = useDispatch();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { _id: id, name, email } = useAppSelector(state => state.user);
  const {
    data: plans,
    refetch: refetchPlans,
    isLoading: getPlansLoading,
  } = useGetPlansQuery(undefined);
  console.log("plans", plans);

  const {
    data: userPlan,
    refetch: refetchUserPlan,
    isLoading: getUserLoading,
  } = useGetUserPlanQuery(
    {
      userId: id,
    },
    { skip: !id },
  );
  // Monitor loading states and set global isLoading
  useEffect(() => {
    if (getPlansLoading || getUserLoading) {
      // If any of the queries are loading, set isLoading to true with a message
      dispatch(setIsLoading({ isLoading: true, message: "Loading data..." }));
    } else {
      // If both queries are done, set isLoading to false
      dispatch(setIsLoading({ isLoading: false, message: "" }));
    }
  }, [getPlansLoading, getUserLoading, dispatch]);

  console.log("user plan", userPlan);

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
          },
        );

        if (verificationResponse.status === 201) {
          Alert.alert("Success", "Payment successful!");
          // Refresh plans and user plan
          await Promise.all([refetchPlans(), refetchUserPlan()]);
        } else {
          throw new Error("Payment verification failed");
        }
      } else {
        throw new Error((error as any)?.message || "Payment failed");
      }
    } catch (error: any) {
      Alert.alert("Error", "Payment Cancelled!");
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
      buy={true}
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
                planName={userPlan.plan.currentPlan.name}
                expiryDate={userPlan.plan.currentPlanExpiration}
                price={userPlan.plan.currentPlan.price}
                minutes={userPlan.plan.currentPlan.minutes}
                validity={userPlan.plan.currentPlan.validity_days}
                buy={false}
                onPress={() => {}}
              />
              <Text className="text-xl font-bold mb-2.5 mt-5">Plans</Text>
            </View>
          ) : (
            <View className="items-center mt-5">
              <Text className="text-xl font-bold mb-2.5 mt-5">
                No Active Subscription
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
});
