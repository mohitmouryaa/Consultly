import React, { useEffect, useState } from "react";
import {
  Modal,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const ImageModal = ({ isVisible, imageUri, onClose }) => {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    // Fetch image size to calculate aspect ratio
    if (imageUri) {
      Image.getSize(imageUri, (width, height) => {
        const aspectRatio = width / height;

        if (aspectRatio > 1) {
          // Landscape
          setImageDimensions({
            width: screenWidth * 0.9, // Image takes 90% of screen width
            height: (screenWidth * 0.9) / aspectRatio, // Adjust height to maintain aspect ratio
          });
        } else {
          // Portrait or square
          setImageDimensions({
            width: screenHeight * 0.8 * aspectRatio, // Adjust width based on aspect ratio
            height: screenHeight * 0.8, // Image takes 80% of screen height
          });
        }
      });
    }
  }, [imageUri, screenWidth, screenHeight]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
          <Image
            source={{ uri: imageUri }}
            style={styles.modalImage}
            resizeMode="contain" // Ensures the full image is visible within the modal
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    //width: "90%", // Adjust based on your layout needs
    //height: "80%", // Adjust based on your layout needs
    width: 225,
    height: 400,
    borderRadius: 10, // Optional, for rounded corners
  },
});

export default ImageModal;
