import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";
import Config from "react-native-config";

export const callApi = createApi({
  reducerPath: "callApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Calls"],
  endpoints: builder => ({
    getCallHistory: builder.query({
      query: id => ({
        url: `${Config.SQL_SERVER_URL}/getHistory/${id}`,
        method: "GET",
      }),
      providesTags: ["Calls"],
    }),
  }),
});

export const { useGetCallHistoryQuery } = callApi;
