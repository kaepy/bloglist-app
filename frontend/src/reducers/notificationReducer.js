/**
 * @module reducers/notificationReducer
 * Redux Toolkit slice for managing UI notification state.
 *
 * State shape: null | { message: string, type: 'success' | 'error' }
 *
 * The showNotification thunk handles auto-dismissal timing and cancels
 * any previously scheduled timeout to prevent stale notifications from
 * clearing a newer one.
 *
 * REFACTORING NOTES:
 * - The module-level `timeoutId` variable works but couples the thunk
 *   to module state, making it harder to test in isolation. Consider
 *   using Redux middleware (e.g., redux-thunk with getState) or an
 *   AbortController pattern for cleaner timeout management.
 * - The `type` parameter defaults to 'success' — consider using an
 *   enum/constant object (e.g., NOTIFICATION_TYPES) to avoid typos.
 */

import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    /** Set the current notification message and type */
    setNotification(state, action) {
      return action.payload;
    },
    /** Clear the notification (reset to null) */
    clearNotification() {
      return null;
    },
  },
});

const { setNotification, clearNotification } = notificationSlice.actions;

/** Module-level timeout handle — used to cancel previous auto-dismiss timers */
let timeoutId = null;

/**
 * Thunk: Show a notification for a specified duration, then auto-dismiss.
 * If called while a previous notification is still visible, the old timeout
 * is cancelled so the new notification gets its full display time.
 *
 * @param {string} message - The text to display
 * @param {number} durationInSeconds - How long before auto-dismiss
 * @param {string} type - 'success' (default) or 'error'
 */
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
