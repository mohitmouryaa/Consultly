import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";
import { SQL_SERVER_URL } from "@env";

export const callApi = createApi({
  reducerPath: "callApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Calls"],
  endpoints: builder => ({
    getCallHistory: builder.query({
      query: id => ({
        url: `${SQL_SERVER_URL}/api/getHistory/${id}`,
        method: "GET",
      }),
      providesTags: ["Calls"],
    }),
  }),
});

export const { useGetCallHistoryQuery } = callApi;
