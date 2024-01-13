import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  INotification,
  NotificationStatusType,
} from "../../../interfaces/notification.inerface";

const initialNotificationState: {
  notification: null | INotification;
} = {
  notification: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState: initialNotificationState,
  reducers: {
    setNotification: (state, action: PayloadAction<INotification>) => {
      const payload: {
        status: NotificationStatusType;
        message: string;
        title: string;
      } = action.payload;

      return { notification: payload };
    },
    resetNotification: () => {
      return {
        notification: null,
      };
    },
  },
});

export const { setNotification, resetNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
