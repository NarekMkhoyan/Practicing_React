import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth/auth-reducer";
import notificationSlice from "./reducers/notifications/notification-reducer";
import userSlice from "./reducers/user/user-reducer";

const rootReducer = combineReducers({
  auth: authSlice,
  notification: notificationSlice,
  user: userSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
