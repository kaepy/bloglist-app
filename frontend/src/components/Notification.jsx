/**
 * @component Notification
 * Displays a Snackbar notification that slides in from the top.
 * Reads notification state from NotificationContext.
 *
 * Uses Snackbar for positioning (fixed, top-center) and Alert for
 * the styled content inside. The context's setTimeout handles dismissal
 * of data — Snackbar's open prop just follows the state.
 */

import { useNotification } from "../hooks/useNotification";
import { Snackbar, Alert, Slide } from "@mui/material";

/**
 * Slide transition — slides down from top.
 * Must be a separate component (not inline arrow function) because
 * MUI uses React.forwardRef internally, and inline functions cause
 * remount on every render → animation breaks.
 */
const SlideTransition = (props) => <Slide {...props} direction="down" />;

const Notification = () => {
  const { notification } = useNotification();

  return (
    <Snackbar
      open={!!notification}
      // Positio: yläreuna, keskellä
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      // Slide-animaatio sisään ylhäältä
      slots={{ transition: SlideTransition }}
      // Ei omaa autoHideDuration — context hoitaa timerin
      sx={{ top: { xs: 70 } }}
    >
      {notification ? (
        <Alert severity={notification.type} variant="filled" elevation={6} sx={{ minWidth: 400 }}>
          {notification.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
};

export default Notification;
