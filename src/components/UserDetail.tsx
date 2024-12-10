import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign"; // Import AntDesign icons

const UserDetail = ({ titleName, iconName, value }) => {
  return (
    <View style={styles.card}>
      {/* First row: Title left-aligned */}
      <Text style={styles.title}>{titleName}</Text>

      {/* Second row: AntDesign Icon and Value */}
      <View style={styles.row}>
        <AntIcon
          name={iconName}
          size={24}
          color="#FFA001"
          style={styles.icon}
        />
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 5,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 10,
    borderColor: "#FFA001", // Border tint color (light grey example)
    borderWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "normal",
    marginBottom: 5,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    textAlign: "left",
  },
});

export default UserDetail;
