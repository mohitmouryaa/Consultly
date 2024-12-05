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
  isPlanActive: boolean;
  sql_id?: string;
  user_type?: "user" | "admin" | "counsellor";
}

const initialState: UserState = {
  isFirstLaunch: false,
  isLoggedIn: false,
  isPlanActive: false,
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
      state.isPlanActive = action.payload.isPlanActive;
      state.user_type = action.payload.user_type || "user";
      state.sql_id = action.payload.sql_id?.toString();
    },
    setIsFirstLaunch: (state, action) => {
      state.isFirstLaunch = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, setIsFirstLaunch, setIsLoggedIn, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
