import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { SettingsProvider } from "./contexts/SettingsContext";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Apply theme from localStorage or default to system preference
const storedTheme = localStorage.getItem("vite-ui-theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
document.documentElement.classList.add(storedTheme || systemTheme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <SettingsProvider>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
