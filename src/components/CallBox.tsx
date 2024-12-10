import { TouchableOpacity, View, Text, Image } from "react-native";
import { useMemo } from "react";
import { images } from "../constants";
import { convertDate } from "../lib/utils";
import { useAppSelector } from "../../store";

export default function CallBox({ item }: CallBoxProps) {
  const userType = useAppSelector(state => state.user.user_type);

  const otherUserType = useMemo(() => {
    return userType === "user" ? "counselor" : "user";
  }, [userType]);

  const imageSrc = useMemo(() => {
    return item?.[otherUserType]?.image
      ? { uri: item?.[otherUserType]?.image }
      : images.profilePic;
  }, [item, otherUserType]);

  const callDuration = parseInt(
    (item?.durationMinutes * 1 || 1).toString(),
    10,
  );
  return (
    <TouchableOpacity>
      <View className="flex-row items-center justify-between border-b-gray-100 border-b-[1px] py-3">
        <View className="flex flex-row items-center">
          <Image
            source={imageSrc}
            alt="profile"
            className="rounded-full w-14 h-14"
          />
          <View className="ml-3">
            <Text className="text-lg font-JakartaBold">
              {item?.[otherUserType]?.name}
            </Text>
            <View className="flex flex-row items-start gap-1">
              <Text className="text-xs font-JakartaMedium">
                {convertDate(item?.callStartTime)}
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-xs font-Jakarta">
          {callDuration} {callDuration > 1 ? "mins" : "min"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
