/**
 * @component Notification
 * Displays a styled notification banner from the NotificationContext.
 * Returns null when there is no active notification, rendering nothing.
 *
 * The notification type ('success' or 'error') determines the text color:
 *   - success: green
 *   - error: red
 */

import { useNotification } from "../hooks/useNotification";
import { Alert } from "@mui/material";

const Notification = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div>
      <Alert severity={notification.type}>{notification.message}</Alert>
    </div>
  );
};

export default Notification;
