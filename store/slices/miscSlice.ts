import { createSlice } from "@reduxjs/toolkit";

interface MiscState {
  isInternetConnected: boolean;
  isDarkTheme: boolean;
}

const initialState: MiscState = {
  isInternetConnected: false,
  isDarkTheme: false,
};

export const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsInternetConnected: (state, action) => {
      state.isInternetConnected = action.payload;
    },
    setIsDarkTheme: (state, action) => {
      state.isDarkTheme = action.payload;
    },
  },
});

export const { setIsInternetConnected, setIsDarkTheme } = miscSlice.actions;

export default miscSlice.reducer;
