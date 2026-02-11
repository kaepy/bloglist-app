import { createSlice } from "@reduxjs/toolkit";

// Create a slice for notification management
const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    // Action to set the notification message
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return null;
    },
  },
});

// Export the action creator
const { setNotification, clearNotification } = notificationSlice.actions;

// Thunk action creator for showing a notification for a specified duration
export const showNotification = (message, durationInSeconds) => {
  return (dispatch) => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, durationInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
