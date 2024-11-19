import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  avatar?: {
    public_id: string;
    url: string;
  };
  username?: string;
  name?: string;
  email?: string;
  token?: string;
  _id?: string;
  isFirstLaunch: boolean;
  isLoggedIn: boolean;
  currentChatDetails: {
    members: string[];
    name: string;
    _id: string;
  };
}

const initialState: UserState = {
  isFirstLaunch: false,
  isLoggedIn: false,
  currentChatDetails: {
    members: [],
    name: "",
    _id: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.avatar = action.payload.avatar;
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state._id = action.payload._id;
    },
    setIsFirstLaunch: (state, action) => {
      state.isFirstLaunch = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    clearUser: state => {
      state.avatar = undefined;
      state.username = undefined;
      state.name = undefined;
      state.email = undefined;
      state._id = undefined;
      state.isLoggedIn = false;
    },
    setCurrentChatDetails: (state, action) => {
      state.currentChatDetails = { ...action.payload };
    },
    clearCurrentChatDetails: state => {
      state.currentChatDetails._id = "";
      state.currentChatDetails.name = "";
      state.currentChatDetails.members = [];
    },
  },
});

export const {
  setUser,
  setIsFirstLaunch,
  setIsLoggedIn,
  clearUser,
  setCurrentChatDetails,
  clearCurrentChatDetails,
} = userSlice.actions;

export default userSlice.reducer;
