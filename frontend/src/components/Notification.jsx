/**
 * @component Notification
 * Displays a styled notification banner from the NotificationContext.
 * Returns null when there is no active notification, rendering nothing.
 *
 * The notification type ('success' or 'error') determines the text color:
 *   - success: green
 *   - error: red
 *
 * REFACTORING NOTES:
 * - The inline styles should be extracted to CSS classes or a CSS module.
 * - Consider adding an aria-live="polite" attribute for accessibility
 *   so screen readers announce notifications automatically.
 * - A fade-out animation would improve UX (CSS transition or framer-motion).
 */

import { useNotification } from "../hooks/useNotification";

const Notification = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  const baseStyle = {
    fontWeight: "bold",
    fontSize: 16,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    background: "lightgrey",
  };

  // Dynamic style: merge base styles with type-specific color
  const style = {
    ...baseStyle,
    color: notification.type === "error" ? "red" : "green",
  };

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
