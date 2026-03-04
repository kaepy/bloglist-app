/**
 * @module theme
 * MUI custom theme — defines the app's visual identity (colors, typography,
 * shape). Every MUI component rendered inside ThemeProvider inherits these.
 *
 * Palette follows the yellow/black/white scheme:
 * - primary: near-black (#212121) — AppBar, text, strong elements
 * - secondary: vivid yellow (#FFD600) — accents, buttons, highlights
 * - background.default: light gray (#FAFAFA) — page background
 * - background.paper: white (#FFFFFF) — cards, papers, elevated surfaces
 */

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#212121", // near-black — pääväri
      contrastText: "#FFFFFF", // valkoinen teksti mustalla taustalla
    },
    secondary: {
      main: "#FFD600", // keltainen — aksenttiväri
      contrastText: "#212121", // musta teksti keltaisella taustalla
    },
    background: {
      default: "#FAFAFA", // sivun taustaväri (hyvin vaalea harmaa)
      paper: "#FFFFFF", // korttien/paperien taustaväri
    },
    text: {
      primary: "#212121", // sama kuin primary.main — selkeä musta teksti
      secondary: "#757575", // keskiharmaa — toissijaiselle tekstille
    },
    divider: "#E0E0E0", // vaalea viiva — hienovarainen erottelu
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    // Sivujen pääotsikot: "Users", "Login to Bloglist", blogin nimi
    h4: {
      fontWeight: 700, // Bold — kuvien tyylinen vahva otsikko
      letterSpacing: "-0.5px", // Tiukempi merkkiväli isossa tekstissä = ammattimaisempi
    },
    // Lomakkeiden otsikot: "Create new blog"
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.3px",
    },
    // Pienemmät otsikot: "Comments", AppBar-teksti
    h6: {
      fontWeight: 600, // Semi-bold — erottuu mutta ei huuda
    },
    // Alaotsikot: "by author"
    subtitle1: {
      fontWeight: 400,
    },
    // Painikkeiden teksti
    button: {
      fontWeight: 600,
      textTransform: "none", // MUI:n oletus on UPPERCASE — "none" on modernimpi
    },
  },
  shape: {
    borderRadius: 8, // Kuvien tyylinen pyöristys — oletus on 4px
  },
  components: {
    // MUI:n Button-komponentti saa automaattisesti secondary-variantin keltaisena
    MuiButton: {
      styleOverrides: {
        outlinedSecondary: {
          // Keltainen reuna, musta teksti — luettava valkoisella taustalla
          color: "#212121",
          borderColor: "#FFD600",
          "&:hover": {
            backgroundColor: "#FFD600", // Keltainen tausta hoverilla
            color: "#212121", // Musta teksti pysyy
            borderColor: "#FFD600",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFD600", // Keltainen focus-reuna
          },
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          marginTop: 16, // = theme.spacing(2)
          // Hienovarainen varjo + keltainen yläreuna — kuvien tyylisen visuaalisen hierarkian luomiseen
          borderTop: "3px solid #FFD600",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)", // Pehmeämpi varjo kuin oletus
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Kerrostettu tausta: B-kirjain-pattern gradientin päällä
          // CSS multiple backgrounds: ensimmäinen on päällimmäinen
          background: [
            // Kerros 1: Toistuva B-kirjain SVG-pattern
            // Joka toinen B peilattu horisontaalisesti — tuo elävyyttä
            // 40×20 tile: normaali B vasemmalla (x=10), peilattu B oikealla (x=30)
            // scale(-1,1) peilaa x-akselin ympäri, translate(60,0) korjaa sijainnin
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='20'%3E%3Ctext x='10' y='10' font-family='Arial' font-weight='bold' font-size='10' fill='%23FFD600' opacity='0.24' text-anchor='middle'%3EB%3C/text%3E%3Ctext x='30' y='15' font-family='Arial' font-weight='bold' font-size='10' fill='%23FFD600' opacity='0.24' text-anchor='middle' transform='translate(60,0) scale(-1,1)'%3EB%3C/text%3E%3C/svg%3E\") repeat",
            // Kerros 2: Hienovarainen keltainen gradient vasemmasta alakulmasta
            "linear-gradient(135deg, rgba(255,214,0,0.12) 0%, #FAFAFA 40%, #FAFAFA 100%)",
          ].join(", "),
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
  },
});

export default theme;
