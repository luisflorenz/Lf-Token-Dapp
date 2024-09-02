import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme"; // Ensure the correct path and no extra spaces in the import
import Minter from "./Minter";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Minter />
      </div>
    </ThemeProvider>
  );
}

export default App;
