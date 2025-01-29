import { FlatList, View } from "react-native";
import { useAppSelector } from "../../../store";
import { useGetCallHistoryQuery } from "../../../store/api";
import { RefreshControl, Text } from "react-native-gesture-handler";
import CallBox from "../../components/CallBox";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../../store/slices/miscSlice";

export default function CallHistory() {
  const user = useAppSelector(state => state.user);
  const {
    data,
    isLoading: refresing,
    refetch,
  } = useGetCallHistoryQuery(user._id);

  const dispatch = useDispatch();
  const calls = useMemo(() => data?.data?.history, [data?.data?.history]);
  console.log("Data -- ", data?.data);
  // const calls = useMemo(() => {
  //   return data?.data?.history ? [...data.data.history].reverse() : [];
  // }, [data?.data?.history]);

  useEffect(() => {
    if (refresing) {
      // Dispatch loading state on the first render
      dispatch(setIsLoading({ isLoading: true, message: "Loading data..." }));
    }

    return () => {
      // When the component unmounts or the data is loaded, reset the loading state
      dispatch(setIsLoading({ isLoading: false, message: "" }));
    };
  });

  return (
    <View className="w-screen h-full px-1 bg-white">
      {/* CALLS */}
      <FlatList
        data={calls}
        keyExtractor={(_item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <CallBox item={item} />}
        className="mx-3"
        //inverted={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresing} onRefresh={refetch} />
        }
        // ListEmptyComponent={EmptyCallList}
        // ListEmptyComponent={
        //   <View className="items-center mt-5">
        //     <Text className="text-xl font-bold mb-2.5 mt-5">
        //       Call History is Empty
        //     </Text>
        //   </View>
        // }
        ListEmptyComponent={
          <View className="items-center justify-center h-[85vh]">
            <Text className="text-xl font-bold text-gray-500 ">
              No call history available
            </Text>
          </View>
        }
      />
    </View>
  );
}
