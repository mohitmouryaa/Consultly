import { createSlice } from "@reduxjs/toolkit";

interface MiscState {
  isInternetConnected: boolean;
  isDarkTheme: boolean;
  isLoading: boolean;
  loadingMessage: string;
}

const initialState: MiscState = {
  isInternetConnected: false,
  isDarkTheme: false,
  isLoading: false,
  loadingMessage: "",
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
    setIsLoading: (state, action) => {
      const { isLoading, message } = action.payload;
      state.isLoading = isLoading;
      state.loadingMessage = message || ""; // Set loading message or default to empty string
    },
  },
});

export const { setIsInternetConnected, setIsDarkTheme, setIsLoading } =
  miscSlice.actions;

export default miscSlice.reducer;
