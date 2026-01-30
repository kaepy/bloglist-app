import PropTypes from "prop-types";

const Error = ({ message }) => {
  const errorStyle = {
    color: "red",
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

  return <div style={errorStyle}>{message}</div>;
};

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
