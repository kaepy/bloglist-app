/**
 * @component Togglable
 * A reusable wrapper that shows/hides its children with a toggle button.
 *
 * Uses forwardRef + useImperativeHandle to expose a toggleVisibility()
 * method to parent components. This allows parents (e.g., BlogForm)
 * to programmatically collapse the content after form submission.
 *
 * Props:
 * - buttonLabel (string, required): Text for the "show" toggle button
 * - children (node, required): Content to show/hide
 *
 * Exposed ref methods:
 * - toggleVisibility(): Flip the visibility state
 */

import { useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
import { Box, Button, Collapse } from "@mui/material";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // Expose toggleVisibility to parent components via ref
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <Box sx={{ my: 2 }}>
      {/* Show "open" button only when content is hidden */}
      {!visible && (
        <Button variant="contained" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      )}

      {/* Animated show/hide of children */}
      <Collapse in={visible}>
        <Box className="togglableContent" sx={{ mt: 2 }}>
          {props.children}
          <Button variant="outlined" color="secondary" onClick={toggleVisibility} sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
});

Togglable.displayName = "Togglable"; // Required when using forwardRef for React DevTools

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Togglable;
