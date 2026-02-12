import { useContext } from "react";
import NotificationContext from "../contexts/NotificationContext";

// Custom hook to use notification context
export const useNotification = () => {
  // Access notification context
  const context = useContext(NotificationContext);

  // Ensure the hook is used within the provider
  if (!context) {
    // Throw error if context is undefined
    throw new Error(
      "useNotification must be used within NotificationContextProvider",
    );
  }
  return context;
};
