import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification); // Get notification from Redux state

  if (!notification) return null; // No notification to display

  // Base style for the notification
  const baseStyle = {
    fontWeight: "bold",
    fontSize: 16,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    background: "lightgrey",
  };

  // Dynamic style based on notification type
  const style = {
    ...baseStyle,
    color: notification.type === "error" ? "red" : "green",
  };

  return <div style={style}>{notification.message}</div>; // Display the notification message
};

export default Notification;
