import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { MMKVLoader } from "react-native-mmkv-storage";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { userSlice } from "./slices/userSlice";

const storage = new MMKVLoader().initialize();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  ["user"]: userSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

const persistor = persistStore(store);

export { store, persistor };
