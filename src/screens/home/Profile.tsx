import React, { memo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import UserDetail from "../../components/UserDetail";
import { icons } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../../store";
import AntIcon from "react-native-vector-icons/AntDesign";
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
import { AxiosError } from "axios";
import httpClient from "../../lib/httpClient";
import { storeToken } from "../../lib/secureStore";
import { setUser } from "../../../store/slices/userSlice";

export default memo(function Profile() {
  const { name, username, email, avatar, _id } = useAppSelector(
    state => state.user,
  );
  const [isEditing, setIsEditing] = useState(false);
  //console.log("Avtar", avatar?.url);
  const [file, setFile] = useState<any | null>(null);
  const [newName, setNewName] = useState(name);
  const [newUsername, setNewUsername] = useState(username);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false); // Loading state

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        //setFile(response.assets[0]);
        const selectedImage = response.assets[0]; // Get the first image
        console.log("Selected Image:", selectedImage); // Log the selected image
        setFile(selectedImage); // Set the file
      }
    });
  };

  const handleEditProfile = () => {
    //console.log("Edit Profile button pressed!");
    setIsEditing(prevState => !prevState);
    console.log("isEditing - ", isEditing);
    // Navigate to edit profile screen or perform any action
  };

  const handleSubmit = async () => {
    if (
      (file === null || file === undefined) &&
      newName === name &&
      newUsername === username
    ) {
      console.log("No changes made");
      //return false; // No changes made, so return false
    } else {
      console.log("Changes detected, submitting");
      setLoading(true); // Show the loader
      try {
        if (!newName || !newUsername) {
          Alert.alert("", "Please fill in all fields");
          return;
        }
        const formData = new FormData();
        if (file != null) {
          formData.append("avatar", {
            uri: file.uri,
            name: file.fileName,
            type: file.mimeType,
          });
        }
        if (newName !== name) {
          formData.append("name", newName);
        }
        if (newUsername !== username) {
          formData.append("username", newUsername);
        }
        formData.append("userid", _id);
        console.log("Form Data - ", formData);

        const response = await httpClient.put("/user/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          Alert.alert("", "Account updated successfully");
          const { user } = response.data;
          dispatch(setUser({ ...user }));
          //await storeToken(token);
          //dispatch(setIsLoggedIn(true));
        }
      } catch (error) {
        const errMessage = (error as AxiosError<{ message: string }>)?.response
          ?.data?.message;
        Alert.alert(
          "",
          errMessage || "An error occurred. Please try again later.",
        );
      } finally {
        setLoading(false); // Hide the loader when done
      }
    }

    // Perform submit logic here

    //console.log("Edit Profile button pressed!");
    setIsEditing(prevState => !prevState);
    setFile(null);
    console.log("Submitted");
    // Navigate to edit profile screen or perform any action
  };

  const handleNameChange = text => {
    setNewName(text); // Update the newName state when text changes
  };

  const handleUserNameChange = text => {
    setNewUsername(text); // Update the newName state when text changes
  };

  const handleEmailChange = text => {
    //setNewUsername(text); // Update the newName state when text changes
  };

  return (
    <SafeAreaView className="flex-col justify-between flex-1 w-full h-full p-5 bg-white ">
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10,
          }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            Updating Profile...
          </Text>
        </View>
      )}
      <ScrollView
        className="max-h-fit"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        onScrollEndDrag={Keyboard.dismiss}>
        {isEditing ? (
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                file
                  ? { uri: file.uri }
                  : avatar?.url
                  ? { uri: avatar.url }
                  : icons.profile
              }
              className="mx-auto my-3 mb-10 border-2 rounded-full w-28 h-28"
              style={{ borderColor: "#FFA001", borderWidth: 1 }}
            />
            <View className="absolute bottom-5 right-32 bg-white rounded-3xl p-[0.5]">
              {/* TODO: PUT PENCIL ICON HERE */}
            </View>
          </TouchableOpacity>
        ) : (
          <Image
            source={avatar?.url ? { uri: avatar.url } : icons.profile}
            className="mx-auto my-3 mb-10 border-2 rounded-full w-28 h-28"
            style={{ borderColor: "#FFA001", borderWidth: 1 }}
          />
        )}
        {/* <ActiveSubscription /> */}
        <UserDetail
          titleName="Name"
          iconName="user"
          defaultValue={name}
          value={newName}
          readOnly={!isEditing}
          onChangeText={handleNameChange}
        />
        <UserDetail
          titleName="User name"
          iconName="user"
          defaultValue={name}
          value={newUsername}
          readOnly={!isEditing}
          onChangeText={handleUserNameChange}
        />
        <UserDetail
          titleName="Email"
          iconName="mail"
          defaultValue={name}
          value={email}
          readOnly={!isEditing}
          onChangeText={handleEmailChange}
        />
      </ScrollView>

      {/* Floating Edit Profile Button */}
      {!isEditing && (
        <TouchableOpacity style={styles.fab} onPress={handleEditProfile}>
          <AntIcon name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Show Submit Button only if isEditing is true */}
      {isEditing && (
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFA001", // Customize button color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  submitButtonContainer: {
    position: "absolute",
    bottom: 20, // Keep the button fixed at the bottom
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: "#FFA001", // Customize your button color
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
