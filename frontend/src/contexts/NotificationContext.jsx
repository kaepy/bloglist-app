/**
 * @module NotificationContext
 * Provides app-wide notification state via useReducer.
 * Consumers should use the paired useNotification() hook — do not access
 * the context directly. showNotification() auto-clears after durationInSeconds.
 * Only one notification is shown at a time — a new call overwrites the previous one.
 */
import { createContext, useReducer } from "react";

const NotificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(NotificationReducer, "");

  const showNotification = (message, durationInSeconds = 5, type = "success") => {
    notificationDispatch({
      type: "SET_NOTIFICATION",
      payload: { message, type },
    });

    setTimeout(() => {
      notificationDispatch({ type: "CLEAR_NOTIFICATION" });
    }, durationInSeconds * 1000);
  };

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch, showNotification }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
