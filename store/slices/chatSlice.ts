import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  currentChatInfo: {
    members: string[];
    name: string;
    _id: string;
  };
  chatMessages: { [key: string]: any };
  chatList: ChatItem[];
  openCallModal: boolean;
  caller: {
    callerId?: string;
    chatId?: string;
    name?: string;
    sql_id?: string;
    user_type?: string;
  };
}

const initialState: ChatState = {
  currentChatInfo: {
    members: [],
    name: "",
    _id: "",
  },
  chatMessages: {},
  chatList: [],
  openCallModal: false,
  caller: {},
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
    setCallModal: (state, action) => {
      state.openCallModal = action.payload;
    },
    setCallerDetails: (state, action) => {
      state.caller = {
        callerId: action.payload._id,
        chatId: action.payload.chatId,
        name: action.payload.name,
        sql_id: action.payload.sql_id,
        user_type: action.payload.user_type,
      };
    },
  },
});

export const {
  setCurrentChatInfo,
  clearCurrentChatInfo,
  setChatMessage,
  setChatList,
  clearUnreadMsgCount,
  setCallModal,
  setCallerDetails,
} = chatSlice.actions;

export default chatSlice.reducer;
