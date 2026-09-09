/**
 * FarmHero Notification Actions & Triggers
 * ─────────────────────────────────────────────────────────────────
 * Geradores automáticos de notificações BASEADOS NOS DADOS REAIS do usuário:
 * - Só disparam se o usuário realmente tem dados registrados
 * - Nunca geram notificações vazias ou falsas
 *
 * 1. 💊 Lembretes de Medicamentos (apenas se há medicamentos cadastrados não tomados)
 * 2. 💧 Alerta de Hidratação (apenas se o usuário já registrou água hoje e está abaixo da meta)
 * 3. 🏃 Atividade Física (apenas se não registrou atividade hoje)
 * 4. 🔔 Lembrete Diário (resume o status real do dia uma vez por dia)
 */

import { addAppNotification } from "./notifications";

const LAST_ALERT_KEY = "farmhero_last_notification_triggers";
const DAILY_REMINDER_DATE_KEY = "farmhero_last_daily_reminder_date";

interface TriggerTimestamps {
  medication?: number;
  water?: number;
  ranking?: number;
  version?: number;
  activity?: number;
}

function getTriggerTimestamps(): TriggerTimestamps {
  try {
    const raw = localStorage.getItem(LAST_ALERT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setTriggerTimestamp(key: keyof TriggerTimestamps) {
  try {
    const stamps = getTriggerTimestamps();
    stamps[key] = Date.now();
    localStorage.setItem(LAST_ALERT_KEY, JSON.stringify(stamps));
  } catch (_err) {
    // Ignore storage error
  }
}

/**
 * Verifica se há medicamentos REAIS pendentes para hoje e envia notificação.
 * Só dispara se o usuário tem pelo menos 1 medicamento cadastrado e não tomado.
 */
export function checkMedicationAlerts(
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    scheduledTime: string;
    taken: boolean;
  }>,
) {
  // Sem medicamentos cadastrados → sem notificação
  if (!medications || medications.length === 0) return;

  const stamps = getTriggerTimestamps();
  const COOLDOWN_MS = 1000 * 60 * 60 * 2; // 2 horas de intervalo entre alertas
  if (stamps.medication && Date.now() - stamps.medication < COOLDOWN_MS) return;

  const pendingMeds = medications.filter((m) => !m.taken);

  // Só notifica se realmente há pendências
  if (pendingMeds.length > 0) {
    const nextMed = pendingMeds[0];
    addAppNotification({
      type: "medicamento",
      title: "💊 Medicamento Pendente!",
      message: `Você tem ${pendingMeds.length} medicamento(s) para tomar hoje. Próximo: ${nextMed.name} (${nextMed.dosage}) às ${nextMed.scheduledTime}.`,
      actionUrl: "/saude/medicamentos",
      icon: "💊",
    });
    setTriggerTimestamp("medication");
  }
}

/**
 * Verifica progresso REAL de hidratação e envia lembrete apenas se o usuário
 * já começou a registrar água hoje mas ainda está abaixo da meta.
 * Se não registrou nada, não envia notificação.
 */
export function checkWaterHydrationAlert(
  waterLogs: Array<{ amountMl: number; time: string }>,
  goalMl: number,
) {
  // Sem nenhum registro de água → sem notificação (usuário ainda não começou)
  if (!waterLogs || waterLogs.length === 0) return;

  const stamps = getTriggerTimestamps();
  const COOLDOWN_MS = 1000 * 60 * 60 * 3; // 3 horas de intervalo
  if (stamps.water && Date.now() - stamps.water < COOLDOWN_MS) return;

  const totalMl = waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);

  // Só notifica se começou mas não completou ainda
  if (totalMl < goalMl) {
    const remaining = goalMl - totalMl;
    const percent = Math.round((totalMl / goalMl) * 100);
    addAppNotification({
      type: "agua",
      title: "💧 Continue se hidratando!",
      message: `Você já bebeu ${totalMl}ml (${percent}% da meta). Faltam ${remaining}ml para completar sua meta de ${goalMl}ml hoje!`,
      actionUrl: "/saude/agua",
      icon: "💧",
    });
    setTriggerTimestamp("water");
  }
}

/**
 * Verifica se o usuário não registrou atividade física hoje.
 * Só notifica se tiver o Lembrete Diário ativo (chamado por checkDailyReminderAlerts).
 */
export function checkActivityAlert(
  activities: Array<{ id: string; durationMinutes: number; time: string }>,
) {
  // Tem atividade registrada hoje → sem notificação
  if (activities && activities.length > 0) return false;
  return true; // sem atividade hoje
}

/**
 * Notificação de disputa no Leaderboard/Ranking
 */
export function triggerRankingAlert(rivalName: string = "outro jogador") {
  const stamps = getTriggerTimestamps();
  const COOLDOWN_MS = 1000 * 60 * 60 * 4; // 4 horas
  if (stamps.ranking && Date.now() - stamps.ranking < COOLDOWN_MS) return;

  addAppNotification({
    type: "ranking",
    title: "🏆 Alerta no Ranking!",
    message: `${rivalName} está quase te ultrapassando no Ranking! Complete suas missões diárias para manter a liderança.`,
    actionUrl: "/desempenho",
    icon: "🏆",
  });
  setTriggerTimestamp("ranking");
}

/**
 * Notificação de Atualização de Versão
 */
export function triggerVersionUpdateAlert(fromVer: string, toVer: string) {
  addAppNotification({
    type: "atualizacao",
    title: `🚀 Atualização: ${toVer}`,
    message: `O FarmaHero foi atualizado de ${fromVer} para ${toVer}! Confira as novidades.`,
    actionUrl: "/settings?tab=notificacoes",
    icon: "🚀",
  });
  setTriggerTimestamp("version");
}

/**
 * LEMBRETE DIÁRIO — verifica o estado REAL do usuário e envia um resumo de saúde.
 * Só é chamado se o usuário ativou o "Lembrete Diário" nas configurações.
 * Dispara no máximo UMA VEZ POR DIA.
 */
export function checkDailyReminderAlerts(appState: {
  waterLogs: Array<{ amountMl: number; time: string }>;
  waterGoalMl: number;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    scheduledTime: string;
    taken: boolean;
  }>;
  activities: Array<{ id: string; durationMinutes: number; time: string }>;
}) {
  const todayStr = new Date().toISOString().split("T")[0];
  const lastReminderDate = localStorage.getItem(DAILY_REMINDER_DATE_KEY);

  // Já enviou o lembrete diário hoje
  if (lastReminderDate === todayStr) return;

  const { waterLogs, waterGoalMl, medications, activities } = appState;

  const totalWaterMl = waterLogs.reduce((acc, l) => acc + l.amountMl, 0);
  const waterPercent = Math.round((totalWaterMl / waterGoalMl) * 100);
  const pendingMeds = medications.filter((m) => !m.taken);
  const hasActivity = activities.length > 0;

  // Só envia se houver algo relevante para reportar
  const hasData =
    waterLogs.length > 0 || medications.length > 0;

  if (!hasData) return;

  // Monta mensagem contextual baseada nos dados reais
  const parts: string[] = [];

  if (waterLogs.length > 0) {
    parts.push(
      totalWaterMl >= waterGoalMl
        ? `💧 Água: Meta atingida (${totalWaterMl}ml)! ✅`
        : `💧 Água: ${waterPercent}% da meta (${totalWaterMl}/${waterGoalMl}ml)`,
    );
  }

  if (medications.length > 0) {
    parts.push(
      pendingMeds.length === 0
        ? `💊 Medicamentos: Todos tomados hoje! ✅`
        : `💊 Medicamentos: ${pendingMeds.length} pendente(s)`,
    );
  }

  if (!hasActivity) {
    parts.push(`🏃 Atividade: Nenhum treino registrado hoje`);
  } else {
    const totalMin = activities.reduce((acc, a) => acc + a.durationMinutes, 0);
    parts.push(`🏃 Atividade: ${totalMin} min registrados hoje ✅`);
  }

  if (parts.length === 0) return;

  addAppNotification({
    type: "lembrete_diario",
    title: "📋 Resumo do seu dia",
    message: parts.join(" · "),
    actionUrl: "/",
    icon: "📋",
  });

  localStorage.setItem(DAILY_REMINDER_DATE_KEY, todayStr);
}
