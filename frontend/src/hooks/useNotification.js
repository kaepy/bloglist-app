/**
 * @hook useNotification
 * Thin wrapper around NotificationContext. Throws if used outside
 * NotificationContextProvider — intentional: silent failures are
 * harder to debug than loud ones.
 */

import { useContext } from "react";
import NotificationContext from "../contexts/NotificationContext";

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationContextProvider");
  }
  return context;
};
