import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { MMKVLoader } from "react-native-mmkv-storage";
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { userSlice } from "./slices/userSlice";
import { chatSlice } from "./slices/chatSlice";
import { miscSlice } from "./slices/miscSlice";
import { chatApi, callApi } from "./api";
import { RESET_STATE_ACTION_TYPE } from "./actions/resetState";
import { deleteToken } from "../src/lib/secureStore";

export const mmkv = new MMKVLoader().initialize();

const persistConfig = {
  key: "root",
  storage: mmkv,
  whitelist: [userSlice.name, chatSlice.name],
};

const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [chatSlice.name]: chatSlice.reducer,
  [miscSlice.name]: miscSlice.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [callApi.reducerPath]: callApi.reducer,
});

const reducer = (state: any, action: any) => {
  if (action.type === RESET_STATE_ACTION_TYPE) {
    deleteToken();
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(chatApi.middleware, callApi.middleware),
});

// Typed hooks for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useReduxDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

const persistor = persistStore(store);

export { store, persistor };
