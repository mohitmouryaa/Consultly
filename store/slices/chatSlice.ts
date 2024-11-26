import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  currentChatInfo: {
    members: string[];
    name: string;
    _id: string;
  };
  chatMessages: { [key: string]: any };
  chatList: ChatItem[];
}

const initialState: ChatState = {
  currentChatInfo: {
    members: [],
    name: "",
    _id: "",
  },
  chatMessages: {},
  chatList: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChatInfo: (state, action) => {
      state.currentChatInfo = { ...action.payload };
    },
    clearCurrentChatInfo: state => {
      state.currentChatInfo._id = "";
      state.currentChatInfo.name = "";
      state.currentChatInfo.members = [];
    },
    setChatMessage: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!chatId || !messages || !Array.isArray(messages)) return;
      state.chatMessages[chatId] = messages;
    },
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    clearUnreadMsgCount: (state, action) => {
      const chatId = action.payload;
      const index = state.chatList.findIndex(chat => chat._id === chatId);
      if (index === -1) return;
      const chat = state.chatList[index];
      chat.messageCount = 0;
      state.chatList[index] = chat;
    },
  },
});

export const {
  setCurrentChatInfo,
  clearCurrentChatInfo,
  setChatMessage,
  setChatList,
  clearUnreadMsgCount,
} = chatSlice.actions;

export default chatSlice.reducer;
