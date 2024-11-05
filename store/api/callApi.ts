import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const callApi = createApi({
  reducerPath: "callApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Calls"],
  endpoints: (builder) => ({
    getCallHistory: builder.query({
      query: (id) => ({
        url: `${process.env.EXPO_PUBLIC_SQL_SERVER_URL}/getHistory/${id}`,
        method: "GET",
      }),
      providesTags: ["Calls"],
    }),
  }),
});

export const { useGetCallHistoryQuery } = callApi;
