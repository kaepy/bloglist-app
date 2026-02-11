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

let timeoutId = null;

// Thunk action creator for showing a notification for a specified duration
export const showNotification = (
  message,
  durationInSeconds,
  type = "success",
) => {
  return (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    dispatch(setNotification({ message, type }));

    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
      timeoutId = null;
    }, durationInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
