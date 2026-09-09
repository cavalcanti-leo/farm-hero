/**
 * FarmHero Notifications Engine
 * ─────────────────────────────────────────────────────────────────
 * REGRA FUNDAMENTAL: Nenhuma notificação falsa é injetada automaticamente.
 * Todas as notificações respeitam rigorosamente as configurações ativas
 * do usuário em src/routes/settings.tsx.
 */

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export type NotificationType =
  | "medicamento"
  | "agua"
  | "atividade"
  | "missoes"
  | "conquista"
  | "ranking"
  | "atualizacao"
  | "humor"
  | "glicemia_pressao"
  | "lembrete_diario";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

export interface NotificationConfigOption {
  id: string;
  type: NotificationType;
  storageKey: string;
  label: string;
  description: string;
  icon: string;
  defaultEnabled: boolean;
}

export const NOTIFICATION_CONFIG_OPTIONS: NotificationConfigOption[] = [
  {
    id: "meds",
    type: "medicamento",
    storageKey: "notif_meds",
    label: "Horário de Medicamentos",
    description: "Alertar nos horários programados de cada remédio cadastrado.",
    icon: "💊",
    defaultEnabled: true,
  },
  {
    id: "water",
    type: "agua",
    storageKey: "notif_water",
    label: "Lembrete de Hidratação (Água)",
    description: "Avisos periódicos para manter a hidratação e bater a meta.",
    icon: "💧",
    defaultEnabled: true,
  },
  {
    id: "activity",
    type: "atividade",
    storageKey: "notif_activity",
    label: "Atividade Física & Treinos",
    description: "Incentivo para registrar exercícios e queima de calorias.",
    icon: "🏃",
    defaultEnabled: true,
  },
  {
    id: "missions",
    type: "missoes",
    storageKey: "notif_missions",
    label: "Missões Diárias & Bônus de XP",
    description: "Avisos quando novas missões diárias estiverem prontas para resgate.",
    icon: "🎯",
    defaultEnabled: true,
  },
  {
    id: "conquistas",
    type: "conquista",
    storageKey: "notif_conquistas",
    label: "Conquistas & Tiers Desbloqueados",
    description: "Celebração quando você sobe de nível, tier ou ganha troféus.",
    icon: "🏆",
    defaultEnabled: true,
  },
  {
    id: "ranking",
    type: "ranking",
    storageKey: "notif_ranking",
    label: "Alertas do Ranking / Leaderboard",
    description: "Avisos de competição quando outro jogador pontuar próximo a você.",
    icon: "⚡",
    defaultEnabled: false, // Desativado por padrão para evitar lembretes excessivos
  },
  {
    id: "updates",
    type: "atualizacao",
    storageKey: "notif_updates",
    label: "Atualizações do Sistema & Patches",
    description: "Avisos sobre novidades, melhorias e novas funcionalidades.",
    icon: "🚀",
    defaultEnabled: true,
  },
  {
    id: "humor",
    type: "humor",
    storageKey: "notif_humor",
    label: "Diário de Humor & Sentimentos",
    description: "Lembrete para registrar seu estado emocional e energia diária.",
    icon: "😊",
    defaultEnabled: true,
  },
  {
    id: "glicemia_pressao",
    type: "glicemia_pressao",
    storageKey: "notif_glicemia_pressao",
    label: "Alertas de Glicemia & Pressão Arterial",
    description: "Lembretes para aferição periódica dos seus sinais vitais.",
    icon: "🩺",
    defaultEnabled: true,
  },
  {
    id: "daily_reminder",
    type: "lembrete_diario",
    storageKey: "notif_daily_reminder",
    label: "Resumo Diário de Saúde (Inteligente)",
    description: "Um resumo consolidado do seu dia enviado no máximo 1x ao dia.",
    icon: "📋",
    defaultEnabled: false, // Desativado por padrão para não incomodar a todo momento
  },
];

// ─── Storage keys ──────────────────────────────────────────────────────────────
const NOTIFICATIONS_KEY = "farmhero_notifications_v3";

/**
 * Verifica se um tipo específico de notificação está habilitado pelo usuário.
 */
export function isNotificationTypeEnabled(type: NotificationType): boolean {
  try {
    const config = NOTIFICATION_CONFIG_OPTIONS.find((c) => c.type === type);
    if (!config) return true;
    const stored = localStorage.getItem(config.storageKey);
    if (stored === null) return config.defaultEnabled;
    return stored === "true";
  } catch {
    return true;
  }
}

/**
 * Salva a preferência de uma categoria de notificação.
 */
export function setNotificationTypeEnabled(storageKey: string, enabled: boolean): void {
  try {
    localStorage.setItem(storageKey, String(enabled));
  } catch {
    // ignore
  }
}

// ─── Limpeza de notificações residuais / fake antigas ─────────────────────────
function cleanOldStorageKeys(): void {
  try {
    localStorage.removeItem("farmhero_notifications_v1");
    localStorage.removeItem("farmhero_notifications_v2");
    localStorage.removeItem("farmhero_version_notif_shown");
    localStorage.removeItem("farmhero_ver_notif_shown_v3");
  } catch {
    // ignore
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getStoredNotifications(): AppNotification[] {
  cleanOldStorageKeys();
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) {
      const parsed: AppNotification[] = JSON.parse(raw);
      // Remove qualquer notificação de teste ou fake antiga que possa ter ficado no storage
      return parsed.filter((n) => n && n.id && n.title && n.type);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveStoredNotifications(list: AppNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission !== "denied") {
    const result = await Notification.requestPermission();
    return result === "granted";
  }
  return false;
}

/**
 * Cria e persiste uma nova notificação real.
 * Respeita estritamente as preferências do usuário.
 */
export function addAppNotification(
  notif: Omit<AppNotification, "id" | "timestamp" | "read">,
): AppNotification | null {
  // Se a categoria estiver desativada nas configurações, não envia
  if (!isNotificationTypeEnabled(notif.type)) {
    return null;
  }

  const list = getStoredNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };

  saveStoredNotifications([newNotif, ...list]);

  // Toast in-app
  toast(newNotif.title, {
    description: newNotif.message,
    icon: newNotif.icon ?? "🔔",
    action: newNotif.actionUrl
      ? {
          label: "Ver",
          onClick: () => {
            window.location.href = newNotif.actionUrl!;
          },
        }
      : undefined,
  });

  // Notificação nativa do navegador (se autorizada)
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(newNotif.title, {
        body: newNotif.message,
        icon: "/favicon.svg",
      });
    } catch {
      // ignore
    }
  }

  return newNotif;
}

// ─── Hook React ───────────────────────────────────────────────────────────────
export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    getStoredNotifications,
  );

  const refresh = useCallback(() => {
    setNotifications(getStoredNotifications());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    addAppNotification,
    refresh,
  };
}
