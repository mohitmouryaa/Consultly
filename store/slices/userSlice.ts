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
  },
});

export const { setUser, setIsFirstLaunch, setIsLoggedIn, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
