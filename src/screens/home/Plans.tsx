import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
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
  const renderItem = ({ item }) => (
    <ActiveSubscription
      planName={item.name}
      expiryDate={item.expiryDate}
      price={item.price}
      minutes={item.minutes}
      validity={item.validity}
    />
    // <View style={styles.item}>
    //   <Text>{item.title}</Text>
    // </View>
  );

  return (
    <SafeAreaView className="flex-col justify-between flex-1 w-full h-full bg-white">
      <FlatList
        style={[{ marginHorizontal: 20 }]}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View>
            <Text style={styles.planTitle}>Your Active Subscription</Text>
            <ActiveSubscription
              planName={"Trial Plan"}
              expiryDate="Expires on 12-07-2024"
              price={"$49.99"}
              minutes={"25/25 minutes"}
              validity={"10 Days"}
            />
            <Text style={[styles.planTitle, { marginTop: 20 }]}>Plans</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
