import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "@/lib/app-state";
import { ThemeProvider } from "@/lib/theme-context";
import { AppRouter } from "@/router";
import { Toaster } from "sonner";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppProvider>
        <Toaster position="top-right" theme="dark" richColors />
        <AppRouter />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);
