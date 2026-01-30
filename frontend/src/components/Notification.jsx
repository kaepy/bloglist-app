import PropTypes from "prop-types";

const Notification = ({ message }) => {
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

  if (message === null) {
    return null;
  }

  return <div style={notificationStyle}>{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string,
};

export default Notification;
