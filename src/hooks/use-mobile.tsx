import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const MOBILE_BREAKPOINT = 768;

// Detecta por User-Agent se é um dispositivo móvel real
function isMobileUserAgent(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
    navigator.userAgent,
  );
}

export type DevViewMode = "auto" | "mobile" | "desktop";

interface DeviceContextType {
  isMobile: boolean;
  deviceType: "mobile" | "desktop";
  devViewMode: DevViewMode;
  setDevViewMode: (mode: DevViewMode) => void;
  rawIsMobile: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  deviceType: "desktop",
  devViewMode: "auto",
  setDevViewMode: () => {},
  rawIsMobile: false,
});

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const isDev = currentUser?.isDev ?? false;

  const [devViewMode, setDevViewModeState] = useState<DevViewMode>(() => {
    try {
      return (localStorage.getItem("farmhero_dev_view_mode") as DevViewMode) || "auto";
    } catch {
      return "auto";
    }
  });

  const [rawIsMobile, setRawIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT || isMobileUserAgent();
  });

  useEffect(() => {
    const check = () => {
      setRawIsMobile(window.innerWidth < MOBILE_BREAKPOINT || isMobileUserAgent());
    };
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", check);
    check();
    return () => mql.removeEventListener("change", check);
  }, []);

  const setDevViewMode = (mode: DevViewMode) => {
    setDevViewModeState(mode);
    try {
      localStorage.setItem("farmhero_dev_view_mode", mode);
    } catch {}
  };

  // Somente o usuário DEV pode forçar manualmente a visualização "mobile" ou "desktop".
  // Para usuários comuns, o sistema identifica automaticamente o dispositivo (PC vs Celular).
  const isMobile = isDev
    ? devViewMode === "mobile"
      ? true
      : devViewMode === "desktop"
        ? false
        : rawIsMobile
    : rawIsMobile;
  const deviceType = isMobile ? "mobile" : "desktop";

  return (
    <DeviceContext.Provider
      value={{
        isMobile,
        deviceType,
        devViewMode,
        setDevViewMode,
        rawIsMobile,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export function useIsMobile(): boolean {
  const ctx = useContext(DeviceContext);
  return ctx.isMobile;
}

export function useDeviceType(): "mobile" | "desktop" {
  const ctx = useContext(DeviceContext);
  return ctx.deviceType;
}

export function useDevView(): DeviceContextType {
  return useContext(DeviceContext);
}
