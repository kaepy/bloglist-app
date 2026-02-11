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
 *
 * REFACTORING NOTES:
 * - Consider accepting an `initiallyVisible` prop for flexibility.
 * - The cancel button text is hardcoded. Consider making it configurable
 *   via a `cancelLabel` prop with a default of "cancel".
 */

import { useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  // CSS display toggle: when visible, hide the "open" button; show the content
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

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
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable"; // Required when using forwardRef for React DevTools

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Togglable;
