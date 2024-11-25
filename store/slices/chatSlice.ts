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
    addNewMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!chatId || !message) return;
      const index = state.chatList.findIndex(chat => chat._id === chatId);
      const chat = state.chatList[index];
      chat.latestMessage = message;
      chat.messageCount += 1;
      state.chatList[index] = chat;
      if (!state.chatMessages[chatId]) {
        state.chatMessages[chatId] = [];
      }
      const messages = [...state.chatMessages[chatId], message];
      state.chatMessages[chatId] = messages;
    },
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
  },
});

export const {
  setCurrentChatInfo,
  clearCurrentChatInfo,
  setChatMessage,
  addNewMessage,
  setChatList,
} = chatSlice.actions;

export default chatSlice.reducer;
