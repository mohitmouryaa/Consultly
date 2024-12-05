import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpClient from "../../src/lib/httpClient";
import { SQL_SERVER_URL } from "@env";

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
    id?: string;
  };
  callLoading: boolean;
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
  callLoading: false,
};

// Create an async thunk for starting a call
export const startCall = createAsyncThunk(
  "chat/startCall",
  async (payload: StartCallPayload, { rejectWithValue }) => {
    try {
      const response = await httpClient.post(
        `${SQL_SERVER_URL}/api/startCall`,
        {
          roomId: payload.roomId,
          counsellorId: payload.counsellorId,
          userId: payload.userId,
        },
      );
      return response.data.callData.id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

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
        sql_id: action.payload.sql_id?.toString(),
        user_type: action.payload.user_type,
      };
    },
    setCallLoading: (state, action) => {
      state.callLoading = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(startCall.pending, state => {
        state.callLoading = true;
      })
      .addCase(startCall.fulfilled, (state, action) => {
        state.caller.id = action.payload;
      })
      .addCase(startCall.rejected, (state, action) => {
        console.error("Start Call Failed:", action.payload);
        state.callLoading = false;
      });
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
  setCallLoading,
} = chatSlice.actions;

export default chatSlice.reducer;
