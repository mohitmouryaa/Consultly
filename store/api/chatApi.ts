import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";
import { SQL_SERVER_URL } from "@env";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Chat"],
  endpoints: builder => ({
    getMyChats: builder.query({
      query: () => ({
        url: "chat/my",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    getChatById: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    getPlans: builder.query({
      query: () => ({
        url: `${SQL_SERVER_URL}/api/plans`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const { useGetMyChatsQuery, useGetChatByIdQuery, useGetPlansQuery } =
  chatApi;
