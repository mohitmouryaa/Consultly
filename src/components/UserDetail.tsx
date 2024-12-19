import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AntIcon from "react-native-vector-icons/AntDesign"; // Import AntDesign icons

const UserDetail = ({
  titleName,
  iconName,
  value,
  readOnly,
  defaultValue,
  onChangeText,
}) => {
  const handleChangeText = onChangeText || (() => {});

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
        {/* <Text style={styles.value}>{value}</Text> */}
        <TextInput
          defaultValue={defaultValue}
          value={value}
          style={styles.value}
          editable={!readOnly} // If readOnly is true, it will be non-editable
          selectTextOnFocus={false} // Prevent text selection when read-only
          pointerEvents={readOnly ? "none" : "auto"} // Disable interactions if readOnly is true
          onChangeText={handleChangeText}
        />
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
