/**
 * @hook useUser
 * Thin wrapper around UserContext. Throws if used outside
 * UserContextProvider — intentional: silent failures are
 * harder to debug than loud ones.
 */

import { use } from "react";
import UserContext from "../contexts/UserContext";

export const useUser = () => {
  const context = use(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserContextProvider");
  }
  return context;
};
