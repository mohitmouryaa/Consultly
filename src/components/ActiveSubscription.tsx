import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign"; // Import AntDesign icons
import { convertDate } from "../lib/utils";

interface ActiveSubscriptionProps {
  planName: string;
  expiryDate: Date;
  price: number;
  minutes: number;
  validity: number;
  onPress: () => void;
}

const ActiveSubscription: React.FC<ActiveSubscriptionProps> = ({
  planName,
  expiryDate,
  price,
  minutes,
  validity,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        {/* First Row: Left-aligned Plan and Right-aligned Expiry Date */}
        <View style={styles.row}>
          <Text style={styles.leftText}>{planName}</Text>
          <Text style={styles.rightText}>
            Expiry: {convertDate(expiryDate)}
          </Text>
        </View>

        {/* Second Row: Price in Bold */}
        <Text style={styles.price}>${price}</Text>
        <View style={styles.line} />
        <View style={styles.rowHorizontal}>
          <AntIcon
            name={"checkcircleo"}
            size={24}
            //color="#000"
            color="#FFA001"
            style={styles.icon}
          />
          <Text style={styles.value}>{minutes} minutes</Text>
        </View>
        <View style={styles.rowHorizontal}>
          <AntIcon
            name={"checkcircleo"}
            size={24}
            //color="#000"
            color="#FFA001"
            style={styles.icon}
          />
          <Text style={styles.value}>{validity} Days</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 5,
    shadowOffset: { width: 0, height: 2 },
    borderColor: "#FFA001", // Border tint color (light grey example)
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Aligns Basic Plan to left and Expiry Date to right
    marginBottom: 10, // Adds space between rows
  },
  leftText: {
    fontSize: 16,
    fontWeight: "600",
  },
  rightText: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  line: {
    height: 1, // Thin line
    //backgroundColor: "#ccc", // Light gray color
    backgroundColor: "#FFA001",
    marginVertical: 10, // Optional: adds space around the line
  },
  rowHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  value: {
    fontSize: 16,
    textAlign: "left",
  },
  icon: {
    marginRight: 10,
  },
});

export default ActiveSubscription;
