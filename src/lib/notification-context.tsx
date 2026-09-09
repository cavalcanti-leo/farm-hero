import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  AppNotification,
  getStoredNotifications,
  saveStoredNotifications,
  addAppNotification,
  requestBrowserNotificationPermission,
} from "./notifications";
import { checkDailyReminderAlerts } from "./notification-actions";
import { useAppState } from "./app-state";

const DAILY_REMINDER_SETTING_KEY = "notif_daily_reminder";

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: typeof addAppNotification;
  requestPermission: () => Promise<boolean>;
  hasPermission: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    getStoredNotifications,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean>(() => {
    return (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    );
  });

  // Acessa o estado real do app para o Lembrete Diário
  const appState = useAppState();

  const refresh = useCallback(() => {
    setNotifications(getStoredNotifications());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, [refresh]);

  // ── Lembrete Diário: verifica histórico real uma vez por dia ──────────────
  useEffect(() => {
    const isDailyReminderEnabled =
      localStorage.getItem(DAILY_REMINDER_SETTING_KEY) === "true";

    if (!isDailyReminderEnabled) return;

    // Pequeno delay para garantir que o app-state carregou os dados do storage
    const timer = setTimeout(() => {
      checkDailyReminderAlerts({
        waterLogs: appState.waterLogs,
        waterGoalMl: appState.waterGoalMl,
        medications: appState.medications,
        activities: appState.activities,
      });
      refresh();
    }, 2000);

    return () => clearTimeout(timer);
    // Executa apenas uma vez no mount (o checkDailyReminderAlerts controla a frequência por data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveStoredNotifications(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveStoredNotifications(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveStoredNotifications([]);
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await requestBrowserNotificationPermission();
    setHasPermission(granted);
    return granted;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification: addAppNotification,
        requestPermission,
        hasPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider",
    );
  }
  return context;
}
