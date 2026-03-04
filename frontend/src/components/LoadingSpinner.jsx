import { Stack, Typography, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const LoadingSpinner = ({ message }) => {
  return (
    <Stack alignItems="center" spacing={2} sx={{ my: 4 }}>
      <CircularProgress color="secondary" />
      <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
        {message || "Loading some data..."}
      </Typography>
    </Stack>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
