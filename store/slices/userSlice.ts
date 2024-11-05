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
  isFirstLaunch?: boolean;
}

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = { ...state, ...action.payload };
    },
    setIsFirstLaunch: (state, action) => {
      state.isFirstLaunch = action.payload;
    },
  },
});

export const { setUser, setIsFirstLaunch } = userSlice.actions;

export default userSlice.reducer;
