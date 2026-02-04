import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Notification = () => {
  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontWeight: "bold",
    fontSize: 16,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  // Get notification message from Redux store
  const message = useSelector((state) => state.notification);

  // Don't render anything if there's no notification
  if (!message) return null;

  return <div style={notificationStyle}>{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string,
};

export default Notification;
