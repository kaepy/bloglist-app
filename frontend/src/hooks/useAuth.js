/**
 * @hook useAuth
 * Combines user management and notifications to provide ready-to-use
 * login and logout handlers for the App component.
 *
 * Separating this logic from App.jsx keeps App focused on rendering
 * and moves the "what happens when you log in/out" concern here.
 *
 * Why a separate hook instead of keeping this in App?
 *   App.jsx should be about structure and rendering — which components
 *   to show and in what order. The logic of "call the login API, handle
 *   errors, show a notification" is behaviour, not rendering. Extracting
 *   it here makes both App and the auth logic independently readable and testable.
 */

import { useUser } from "./useUser";
import { useNotification } from "./useNotification";

export const useAuth = () => {
  const { loginMutation, logout } = useUser();
  const { showNotification } = useNotification();

  /** Authenticate with credentials and show a welcome or error notification */
  const handleLogin = async (credentials) => {
    try {
      const user = await loginMutation.mutateAsync(credentials);
      showNotification(`Welcome back, ${user.name}!`, 5, "success");
    } catch (error) {
      showNotification(error.response?.data?.error || "Oops! Wrong credentials. Try again :)", 5, "error");
    }
  };

  /** Clear the session and show a farewell notification */
  const handleLogout = () => {
    const loggedOutUser = logout();
    showNotification(`See you again ${loggedOutUser.name}!`, 5, "success");
  };

  return { handleLogin, handleLogout };
};
