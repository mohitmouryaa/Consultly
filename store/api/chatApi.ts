import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

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
  }),
});

export const { useGetMyChatsQuery, useGetChatByIdQuery } = chatApi;
