import React, { memo, useMemo, useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useAppSelector } from "../../../store";
import { convertChatDate } from "../../lib/utils";
import ImageModal from "../ImageModal";

const RenderMessage = ({ item }: { item: any }) => {
  const userId = useAppSelector(state => state.user._id);
  const isMyMessage = item?.sender?._id === userId;
  const [modalVisible, setModalVisible] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const imageUri = useMemo(
    () =>
      item.attachments && item.attachments.length > 0
        ? item.attachments[0].url
        : null,
    [item.attachments],
  );

  useEffect(() => {
    if (item?.attachments && item.attachments[0]?.url) {
      const imageUri = item.attachments[0].url;
      Image.getSize(imageUri, (width, height) => {
        const aspectRatio = width / height;

        if (aspectRatio > 1) {
          // Landscape
          setImageDimensions({
            width: screenWidth * 0.6, // Image takes 60% of screen width for landscape
            height: (screenWidth * 0.6) / aspectRatio, // Adjust height based on aspect ratio
          });
        } else {
          // Portrait or square
          setImageDimensions({
            width: screenHeight * 0.4 * aspectRatio, // Adjust width based on aspect ratio for portrait
            height: screenHeight * 0.4, // Image takes 40% of screen height
          });
        }
      });
    }
  }, [item]);

  const messageTime = useMemo(() => {
    return convertChatDate(item?.createdAt || item?.timestamp);
  }, [item]);

  const openModal = () => {
    setModalVisible(true); // Show modal when the image is clicked
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <View
      className={`max-w-[70%] p-2.5 mx-2.5 rounded-xl my-1.5 ${
        isMyMessage ? "self-end bg-[#f0f0f0]" : "self-start bg-[#e3be81]"
      }`}>
      {imageUri ? (
        <View>
          <TouchableOpacity onPress={openModal}>
            <Image
              source={{ uri: item.attachments[0].url }} // Using the URL from the first attachment
              style={[
                {
                  width: imageDimensions.width,
                  height: imageDimensions.height,
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <ImageModal
            isVisible={modalVisible}
            imageUri={imageUri}
            onClose={closeModal}
          />
        </View>
      ) : (
        <Text className="text-base">{item.content}</Text>
      )}

      <View className="flex flex-row items-center justify-between mt-2">
        <Text className="text-xs text-[#888] mr-1.5">{messageTime}</Text>
        {isMyMessage ? renderStatusIcon(item.status) : null}
      </View>
    </View>
  );
};

const renderStatusIcon = (status: string) => {
  switch (status) {
    case "not_sent":
      return (
        <AntDesign
          name="clockcircleo"
          size={12}
          className="ml-1.5 text-[#888]"
        />
      ); // Not sent icon
    case "sent":
      return (
        <AntDesign name="check" size={12} className="ml-1.5 text-[#888]" />
      ); // Sent icon (single check circle)
    case "delivered":
      return (
        <AntDesign
          name="checkcircleo"
          size={12}
          className="ml-1.5 text-[#888]"
        />
      ); // Delivered icon (filled double check)
    case "seen":
      return (
        <AntDesign
          name="checkcircleo"
          size={12}
          className="ml-1.5 text-[#87CEEB]"
        />
      ); // Seen icon (eye outline)
    default:
      return null;
  }
};

export default memo(RenderMessage);
