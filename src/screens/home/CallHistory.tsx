import React, { memo } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../store";
import { useGetCallHistoryQuery } from "../../../store/api";
import { RefreshControl } from "react-native-gesture-handler";

// export default memo(function CallHistory() {
//   return (
//     <SafeAreaView className="items-center justify-center flex-1 bg-white">
//       <Text className="text-3xl font-bold">Call History</Text>
//     </SafeAreaView>
//   );
// });

export default function CallHistory() {
  const user = useAppSelector((state) => state.user);
  const { data, isLoading: refresing, refetch } = useGetCallHistoryQuery(user._id);
  const calls = data?.data?.history || [];
  return (
    <View className="w-screen h-full px-1 bg-white">
      {/* CALLS */}
      <FlatList
        data={calls}
        keyExtractor={(_item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <CallBox item={item} />}
        className="mx-3"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refresing} onRefresh={refetch} />}
        //ListEmptyComponent={EmptyCallList}
      />
    </View>
  );
}
