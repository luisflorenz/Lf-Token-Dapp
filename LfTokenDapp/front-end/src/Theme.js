import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffc926",
    },
    secondary: {
      main: "#088ef3",
    },
    background: {
      default: "#121212", // Dark background for better contrast
      paper: "#1e1e1e", // Lighter background for cards and surfaces
    },
    text: {
      primary: "#ffffff", // Main text color
      secondary: "#b0b0b0", // Secondary text color
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 700,
      marginBottom: "16px",
      fontSize: "2rem", // Set a specific font size
    },
    h5: {
      fontWeight: 600,
      marginBottom: "12px",
      fontSize: "1.5rem", // Set a specific font size
    },
    h6: {
      fontWeight: 500,
      marginBottom: "8px",
      fontSize: "1.25rem", // Set a specific font size
    },
    subtitle1: {
      fontWeight: 400,
      marginBottom: "8px",
      fontSize: "1rem", // Set a specific font size
    },
    caption: {
      fontStyle: "italic",
      fontSize: "0.875rem", // Set a specific font size
    },
  },
  spacing: 8, // Define a base spacing unit
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Round button corners
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px", // Consistent spacing for text fields
        },
      },
    },
  },
});

export default theme;
