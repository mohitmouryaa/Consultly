import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  currentChatInfo: {
    members: string[];
    name: string;
    _id: string;
  };
  chatMessages: { [key: string]: any };
}

const initialState: ChatState = {
  currentChatInfo: {
    members: [],
    name: "",
    _id: "",
  },
  chatMessages: {},
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
      state.chatMessages[chatId] = [...state.chatMessages[chatId], message];
    },
  },
});

export const {
  setCurrentChatInfo,
  clearCurrentChatInfo,
  setChatMessage,
  addNewMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
