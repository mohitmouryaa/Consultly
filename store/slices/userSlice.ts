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
}

const initialState: UserState = {
  isFirstLaunch: false,
  isLoggedIn: false,
};

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
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setUser, setIsFirstLaunch, setIsLoggedIn } = userSlice.actions;

export default userSlice.reducer;
