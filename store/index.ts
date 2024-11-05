import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { MMKVLoader } from "react-native-mmkv-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { userSlice } from "./slices/userSlice";
import { callApi, chatApi } from "./api";

const storage = new MMKVLoader().initialize();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  ["user"]: userSlice.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [callApi.reducerPath]: callApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(chatApi.middleware, callApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

const persistor = persistStore(store);

export { store, persistor };
