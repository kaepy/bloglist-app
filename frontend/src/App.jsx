/**
 * @component App
 * Root component — renders either the login view (unauthenticated) or the
 * authenticated app view based on user context.
 */

import { BrowserRouter as Router } from "react-router-dom";

import { useUser } from "./hooks/useUser";
import { useAuth } from "./hooks/useAuth";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import AppLayout from "./components/AppLayout";

import { Typography, Box, Card } from "@mui/material";
import Book from "@mui/icons-material/Book";

const App = () => {
  const { user } = useUser();
  const { handleLogin, handleLogout } = useAuth();

  return (
    <>
      {/* Snackbar is fixed-positioned — rendered once, visible everywhere */}
      <Notification />

      {!user ? (
      <Box
        sx={{
          // Ulompi Box — täyttää koko viewportin ja keskittää kortin
          // Koko näytön korkeus — tarvitaan jotta vertical centering toimii
          minHeight: "100vh",
          // Flex-centering: lapsi (Card) keskelle molempiin suuntiin
          display: "flex",
          justifyContent: "center", // horisontaalinen keskitys
          alignItems: "center", // vertikaalinen keskitys
          // Taustakuvio: hienovarainen diagonaalinen liukuväri
          // Keltainen vasemmasta alakulmasta → vaalea oikeaan yläkulmaan
          background: "linear-gradient(135deg, #FFD600 0%, #FAFAFA 50%, #FAFAFA 100%)",
        }}
      >
        <Card
          sx={{
            p: 4, // Sisäinen padding (32px)
            width: "100%",
            maxWidth: 420, // Ei leviä liian leveäksi
            // Ylikirjoitetaan teeman MuiCard marginTop — login-kortissa
            // ei tarvita ylämarginaalia koska flex hoitaa sijoittelun
            mt: 0,
            textAlign: "center", // Otsikko ja nappi keskelle
          }}
        >
          <Book sx={{ fontSize: 48, color: "secondary.main", mb: 1 }} />

          <Typography variant="h4" component="h1" gutterBottom>
            Bloglist
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to continue
          </Typography>

          <LoginForm handleLogin={handleLogin} />
        </Card>
      </Box>
    ) : (
      <Router>
        <AppLayout user={user} handleLogout={handleLogout} />
      </Router>
    )}
    </>
  );
};

export default App;
