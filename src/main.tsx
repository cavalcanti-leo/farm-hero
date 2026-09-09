import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AppProvider } from "@/lib/app-state";
import { AppRouter } from "@/router";
import { Toaster } from "sonner";
import "@/index.css";

import { NotificationProvider } from "@/lib/notification-context";

import { DeviceProvider } from "@/hooks/use-mobile";

// Wrapper que monta um AppProvider separado por userId
// A prop key força React a remontar completamente quando o usuário muda
const UserScopedApp: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <DeviceProvider>
      <AppProvider key={currentUser?.id ?? "guest"} userId={currentUser?.id}>
        <NotificationProvider>
          <Toaster position="top-right" theme="dark" richColors />
          <AppRouter />
        </NotificationProvider>
      </AppProvider>
    </DeviceProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <UserScopedApp />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
