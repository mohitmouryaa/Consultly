import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getMyChats: builder.query({
      query: () => ({
        url: "chat/my",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const { useGetMyChatsQuery } = chatApi;
