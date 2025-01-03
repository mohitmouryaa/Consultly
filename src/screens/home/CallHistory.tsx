import { FlatList, View } from "react-native";
import { useAppSelector } from "../../../store";
import { useGetCallHistoryQuery } from "../../../store/api";
import { RefreshControl } from "react-native-gesture-handler";
import CallBox from "../../components/CallBox";
import { useMemo } from "react";

export default function CallHistory() {
  const user = useAppSelector(state => state.user);
  const {
    data,
    isLoading: refresing,
    refetch,
  } = useGetCallHistoryQuery(user._id);

  const calls = useMemo(() => data?.data?.history, [data?.data?.history]);
  console.log("Data -- ", data?.data);
  // const calls = useMemo(() => {
  //   return data?.data?.history ? [...data.data.history].reverse() : [];
  // }, [data?.data?.history]);

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
      />
    </View>
  );
}
