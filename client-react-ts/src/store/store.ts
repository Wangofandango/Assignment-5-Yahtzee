import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./slices";
import { gameSyncMiddleware } from "./middleware";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(gameSyncMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
