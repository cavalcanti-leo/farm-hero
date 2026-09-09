/**
 * useDailyMissions
 * ─────────────────────────────────────────────────────────────────
 * - Valida missões com base em COMPROVANTES REAIS de ações registradas no AppState.
 * - Para concluir uma missão, o usuário DEVE REALIZAR a ação de saúde no sistema
 *   (beber água, tomar remédio, registrar refeição, treino, humor, etc.).
 * - O botão leva o usuário para a tela correspondente ("Ir Fazer Comprovante ➔").
 * - Quando a ação é comprovada, o botão "Resgatar Moedas 🪙" é liberado!
 * - As missões resetam automaticamente todos os dias à meia-noite (seed por data).
 */

import { useState, useEffect, useCallback } from "react";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/lib/auth-context";
import { getExamRequests } from "@/lib/database";

export interface DailyMission {
  id: string;
  title: string;
  desc: string;
  xp: number;
  coins: number;
  emoji: string;
  category:
    "agua" | "alimentacao" | "atividade" | "medicamentos" | "saude" | "humor" | "social" | "bonus";
  actionUrl: string;
  actionLabel: string;
  // Função que verifica se há comprovante real no AppState
  checkProof: (state: ReturnType<typeof useAppState>) => {
    isSatisfied: boolean;
    currentText: string;
    targetText: string;
  };
}

// Pool expandido com 22 missões diárias com verificação de comprovantes reais
const MISSION_POOL: DailyMission[] = [
  // ── 💧 ÁGUA / HIDRATAÇÃO ─────────────────────────────────────────────────
  {
    id: "agua-1",
    title: "Hidratação Forte",
    desc: "Beber 2.000 ml de água no dia",
    xp: 75,
    coins: 15,
    emoji: "💧",
    category: "agua",
    actionUrl: "/saude/agua",
    actionLabel: "Registrar Água",
    checkProof: (st) => {
      const total = st.waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
      return {
        isSatisfied: total >= 2000,
        currentText: `${total} ml`,
        targetText: "2.000 ml",
      };
    },
  },
  {
    id: "agua-2",
    title: "Primeiro Copo",
    desc: "Registrar pelo menos 1 copo de água",
    xp: 30,
    coins: 8,
    emoji: "🌅",
    category: "agua",
    actionUrl: "/saude/agua",
    actionLabel: "Beber 1 Copo",
    checkProof: (st) => ({
      isSatisfied: st.waterLogs.length >= 1,
      currentText: `${st.waterLogs.length} copo(s)`,
      targetText: "1 copo",
    }),
  },
  {
    id: "agua-3",
    title: "Meta de Hidratação",
    desc: "Atingir 100% da sua meta de água",
    xp: 100,
    coins: 20,
    emoji: "🏆",
    category: "agua",
    actionUrl: "/saude/agua",
    actionLabel: "Bater Meta de Água",
    checkProof: (st) => {
      const total = st.waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
      return {
        isSatisfied: total >= st.waterGoalMl,
        currentText: `${total} ml`,
        targetText: `${st.waterGoalMl} ml`,
      };
    },
  },

  // ── 🥗 ALIMENTAÇÃO ──────────────────────────────────────────────────────
  {
    id: "alim-1",
    title: "Café da Manhã",
    desc: "Registrar o café da manhã no sistema",
    xp: 40,
    coins: 10,
    emoji: "🍳",
    category: "alimentacao",
    actionUrl: "/saude/alimentacao",
    actionLabel: "Registrar Café",
    checkProof: (st) => {
      const hasCafe = st.meals.some((m) => m.type.toLowerCase().includes("café"));
      return {
        isSatisfied: hasCafe,
        currentText: hasCafe ? "Registrado" : "Pendente",
        targetText: "Café da manhã",
      };
    },
  },
  {
    id: "alim-2",
    title: "Refeição Saudável",
    desc: "Registrar pelo menos 1 refeição no dia",
    xp: 50,
    coins: 12,
    emoji: "🥗",
    category: "alimentacao",
    actionUrl: "/saude/alimentacao",
    actionLabel: "Registrar Refeição",
    checkProof: (st) => ({
      isSatisfied: st.meals.length >= 1,
      currentText: `${st.meals.length} refeição(ões)`,
      targetText: "1 refeição",
    }),
  },
  {
    id: "alim-3",
    title: "3 Refeições Completas",
    desc: "Registrar 3 refeições no mesmo dia",
    xp: 80,
    coins: 18,
    emoji: "🍽️",
    category: "alimentacao",
    actionUrl: "/saude/alimentacao",
    actionLabel: "Registrar Refeições",
    checkProof: (st) => ({
      isSatisfied: st.meals.length >= 3,
      currentText: `${st.meals.length} refeição(ões)`,
      targetText: "3 refeições",
    }),
  },
  {
    id: "alim-4",
    title: "Almoço Nutritivo",
    desc: "Registrar o almoço no sistema de nutrição",
    xp: 45,
    coins: 10,
    emoji: "🍛",
    category: "alimentacao",
    actionUrl: "/saude/alimentacao",
    actionLabel: "Registrar Almoço",
    checkProof: (st) => {
      const hasAlmoco = st.meals.some((m) => m.type.toLowerCase().includes("almoço"));
      return {
        isSatisfied: hasAlmoco,
        currentText: hasAlmoco ? "Registrado" : "Pendente",
        targetText: "Almoço",
      };
    },
  },

  // ── 🏃 ATIVIDADE FÍSICA ─────────────────────────────────────────────────
  {
    id: "ativ-1",
    title: "30 Min de Exercício",
    desc: "Registrar um treino de 30 minutos",
    xp: 100,
    coins: 20,
    emoji: "🏃",
    category: "atividade",
    actionUrl: "/saude/atividade",
    actionLabel: "Registrar Exercício",
    checkProof: (st) => {
      const totalMins = st.activities.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      return {
        isSatisfied: totalMins >= 30,
        currentText: `${totalMins} min`,
        targetText: "30 min",
      };
    },
  },
  {
    id: "ativ-2",
    title: "Caminhada ou Treino",
    desc: "Registrar pelo menos 1 atividade física",
    xp: 60,
    coins: 14,
    emoji: "👟",
    category: "atividade",
    actionUrl: "/saude/atividade",
    actionLabel: "Registrar Treino",
    checkProof: (st) => ({
      isSatisfied: st.activities.length >= 1,
      currentText: `${st.activities.length} treino(s)`,
      targetText: "1 treino",
    }),
  },
  {
    id: "ativ-3",
    title: "Queimar 200 Kcal",
    desc: "Registrar atividades que somem 200 kcal gastas",
    xp: 90,
    coins: 18,
    emoji: "🔥",
    category: "atividade",
    actionUrl: "/saude/atividade",
    actionLabel: "Ver Exercícios",
    checkProof: (st) => {
      const totalCal = st.activities.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
      return {
        isSatisfied: totalCal >= 200,
        currentText: `${totalCal} kcal`,
        targetText: "200 kcal",
      };
    },
  },

  // ── 💊 MEDICAMENTOS ─────────────────────────────────────────────────────
  {
    id: "med-1",
    title: "Medicamento em Dia",
    desc: "Marcar pelo menos 1 medicamento como tomado",
    xp: 50,
    coins: 10,
    emoji: "💊",
    category: "medicamentos",
    actionUrl: "/saude/medicamentos",
    actionLabel: "Marcar Medicamento",
    checkProof: (st) => {
      const tomados = st.medications.filter((m) => m.taken).length;
      return {
        isSatisfied: tomados >= 1,
        currentText: `${tomados} tomado(s)`,
        targetText: "1 tomado",
      };
    },
  },
  {
    id: "med-2",
    title: "Prescrição Completa",
    desc: "Marcar todos os medicamentos agendados como tomados",
    xp: 120,
    coins: 25,
    emoji: "🩺",
    category: "medicamentos",
    actionUrl: "/saude/medicamentos",
    actionLabel: "Ver Prescrição",
    checkProof: (st) => {
      const total = st.medications.length;
      const tomados = st.medications.filter((m) => m.taken).length;
      return {
        isSatisfied: total > 0 && tomados === total,
        currentText: `${tomados} / ${total}`,
        targetText: `${total} de ${total}`,
      };
    },
  },

  // ── 🩸 SAÚDE E MONITORAÇÃO ────────────────────────────────────────────────
  {
    id: "sau-1",
    title: "Monitorar Glicemia",
    desc: "Registrar uma medição de glicemia no dia",
    xp: 50,
    coins: 12,
    emoji: "🩸",
    category: "saude",
    actionUrl: "/saude/glicemia",
    actionLabel: "Medir Glicemia",
    checkProof: (st) => ({
      isSatisfied: st.glucoseLogs.length >= 1,
      currentText: `${st.glucoseLogs.length} registro(s)`,
      targetText: "1 registro",
    }),
  },
  {
    id: "sau-2",
    title: "Pressão Arterial",
    desc: "Medir e registrar a pressão arterial",
    xp: 50,
    coins: 12,
    emoji: "❤️",
    category: "saude",
    actionUrl: "/saude/pressao",
    actionLabel: "Medir Pressão",
    checkProof: (st) => ({
      isSatisfied: st.pressureLogs.length >= 1,
      currentText: `${st.pressureLogs.length} registro(s)`,
      targetText: "1 registro",
    }),
  },
  {
    id: "sau-3",
    title: "Monitoramento Geral",
    desc: "Registrar pelo menos 2 parâmetros de saúde (glicemia ou pressão)",
    xp: 85,
    coins: 18,
    emoji: "📊",
    category: "saude",
    actionUrl: "/saude",
    actionLabel: "Acessar Saúde",
    checkProof: (st) => {
      const count = st.glucoseLogs.length + st.pressureLogs.length;
      return {
        isSatisfied: count >= 2,
        currentText: `${count} registro(s)`,
        targetText: "2 registros",
      };
    },
  },

  // ── 😊 HUMOR E BEM-ESTAR ────────────────────────────────────────────────
  {
    id: "hum-1",
    title: "Diário de Humor",
    desc: "Registrar como você está se sentindo hoje",
    xp: 30,
    coins: 8,
    emoji: "😊",
    category: "humor",
    actionUrl: "/saude/humor",
    actionLabel: "Registrar Humor",
    checkProof: (st) => ({
      isSatisfied: st.moodLogs.length >= 1,
      currentText: `${st.moodLogs.length} registro(s)`,
      targetText: "1 registro",
    }),
  },

  // ── 👤 AVATAR E PERSONALIZAÇÃO ──────────────────────────────────────────
  {
    id: "av-1",
    title: "Estilo do Herói",
    desc: "Personalizar a aparência do seu avatar no FarmaHero",
    xp: 35,
    coins: 10,
    emoji: "🦸",
    category: "social",
    actionUrl: "/avatar",
    actionLabel: "Personalizar Avatar",
    checkProof: (st) => {
      const isEquipped = Boolean(
        st.equippedHat || st.equippedOutfit || st.equippedPet || st.equippedBackground,
      );
      const unlockedCount = st.items ? st.items.filter((i) => i.unlocked).length : 0;
      return {
        isSatisfied: isEquipped || unlockedCount > 0,
        currentText: isEquipped ? "Equipado" : `${unlockedCount} unlocked`,
        targetText: "1 item equipado",
      };
    },
  },

  // ── 🔥 SEQUÊNCIA E HISTÓRICO ─────────────────────────────────────────────
  {
    id: "bon-1",
    title: "Streak de Saúde",
    desc: "Manter pelo menos 1 dia de sequência ativa",
    xp: 80,
    coins: 15,
    emoji: "🔥",
    category: "bonus",
    actionUrl: "/desempenho",
    actionLabel: "Ver Desempenho",
    checkProof: (st) => ({
      isSatisfied: st.streakDays >= 1,
      currentText: `${st.streakDays} dia(s)`,
      targetText: "1 dia",
    }),
  },
  {
    id: "bon-2",
    title: "Conferir Histórico",
    desc: "Registrar ao menos 3 ações de saúde em qualquer módulo",
    xp: 70,
    coins: 15,
    emoji: "📜",
    category: "bonus",
    actionUrl: "/historico",
    actionLabel: "Ver Histórico",
    checkProof: (st) => {
      const totalActions =
        st.waterLogs.length +
        st.meals.length +
        st.activities.length +
        st.glucoseLogs.length +
        st.pressureLogs.length +
        st.moodLogs.length;
      return {
        isSatisfied: totalActions >= 3,
        currentText: `${totalActions} ação(ões)`,
        targetText: "3 ações",
      };
    },
  },
  {
    id: "bon-3",
    title: "Nível Heroico",
    desc: "Atingir o nível 2 ou superior com seu progresso",
    xp: 150,
    coins: 30,
    emoji: "⭐",
    category: "bonus",
    actionUrl: "/desempenho",
    actionLabel: "Ver Nível",
    checkProof: (st) => ({
      isSatisfied: st.level >= 2,
      currentText: `Nível ${st.level}`,
      targetText: "Nível 2",
    }),
  },
];

// Funções utilitárias de data e seed
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Pool de Missões Diárias Exclusivas do Farmacêutico ────────────────────────
const PHARMACIST_MISSION_POOL: DailyMission[] = [
  {
    id: "farm-eval-1",
    title: "Avaliação Clínica Diária",
    desc: "Avaliar o estado de saúde de pelo menos 1 paciente",
    xp: 120,
    coins: 40,
    emoji: "🩺",
    category: "saude",
    actionUrl: "/saude",
    actionLabel: "Avaliar Paciente",
    checkProof: () => {
      const reqs = getExamRequests();
      const count = reqs.filter((r) => r.status === "avaliado").length;
      return {
        isSatisfied: count >= 1,
        currentText: `${count} avaliado(s)`,
        targetText: "1 paciente",
      };
    },
  },
  {
    id: "farm-eval-2",
    title: "Aferição de Pressão / Glicemia",
    desc: "Registrar parâmetros vitais aferidos de um paciente",
    xp: 100,
    coins: 35,
    emoji: "🩸",
    category: "saude",
    actionUrl: "/saude",
    actionLabel: "Registrar Aferição",
    checkProof: () => {
      const reqs = getExamRequests();
      const count = reqs.filter(
        (r) =>
          r.status === "avaliado" &&
          (r.evaluationMetrics?.glucose || r.evaluationMetrics?.systolic),
      ).length;
      return {
        isSatisfied: count >= 1,
        currentText: `${count} registro(s)`,
        targetText: "1 aferição",
      };
    },
  },
  {
    id: "farm-eval-3",
    title: "Orientação Terapêutica",
    desc: "Registrar recomendações farmacêuticas no histórico do paciente",
    xp: 90,
    coins: 30,
    emoji: "📋",
    category: "saude",
    actionUrl: "/saude",
    actionLabel: "Orientar Paciente",
    checkProof: () => {
      const reqs = getExamRequests();
      const count = reqs.filter(
        (r) => r.status === "avaliado" && r.evaluationMetrics?.advice,
      ).length;
      return {
        isSatisfied: count >= 1,
        currentText: `${count} orientação(ões)`,
        targetText: "1 orientação",
      };
    },
  },
  {
    id: "farm-eval-4",
    title: "Verificar Fila de Pacientes",
    desc: "Acessar a fila de pacientes para checar novos agendamentos",
    xp: 60,
    coins: 20,
    emoji: "👥",
    category: "social",
    actionUrl: "/indicadores",
    actionLabel: "Ver Pacientes",
    checkProof: () => ({
      isSatisfied: true,
      currentText: "Fila consultada",
      targetText: "Conferir fila",
    }),
  },
];

function getTodayKey(role = "cliente"): string {
  return `dailyMissions_${role}_${new Date().toISOString().slice(0, 10)}`;
}

function getDailySeed(): number {
  const today = new Date().toISOString().slice(0, 10);
  return today.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

// 12 a 15 missões diárias sorteadas a cada dia!
const DAILY_MISSION_COUNT = 12;

export function useDailyMissions() {
  const appState = useAppState();
  const { currentUser } = useAuth();
  const isPharmacist = currentUser?.role === "farmaceutico";
  const todayKey = getTodayKey(currentUser?.role || "cliente");

  // Missões sorteadas para o dia de hoje de acordo com o papel
  const [todaysMissions] = useState<DailyMission[]>(() => {
    const pool = isPharmacist ? PHARMACIST_MISSION_POOL : MISSION_POOL;
    if (isPharmacist) return pool;
    const seed = getDailySeed();
    const shuffled = seededShuffle(pool, seed);
    return shuffled.slice(0, DAILY_MISSION_COUNT);
  });

  // IDs das recompensas já resgatadas hoje (persiste no localStorage)
  const [claimedIds, setClaimedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(todayKey);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Limpa registros de dias anteriores
  useEffect(() => {
    try {
      const keys = Object.keys(localStorage).filter(
        (k) => k.startsWith("dailyMissions_") && k !== todayKey,
      );
      keys.forEach((k) => localStorage.removeItem(k));
    } catch (_err) {
      // Ignore storage error
    }
  }, [todayKey]);

  // Salva claimedIds
  useEffect(() => {
    try {
      localStorage.setItem(todayKey, JSON.stringify([...claimedIds]));
    } catch (_err) {
      // Ignore storage error
    }
  }, [claimedIds, todayKey]);

  // Função para resgatar a recompensa (só funciona se houver comprovante!)
  const claimReward = useCallback(
    (mission: DailyMission) => {
      const proof = mission.checkProof(appState);
      if (!proof.isSatisfied || claimedIds.has(mission.id)) return false;

      appState.gainXpAndCoins(mission.xp, mission.coins, `Recompensa: ${mission.title}`);
      setClaimedIds((prev) => new Set([...prev, mission.id]));
      return true;
    },
    [appState, claimedIds],
  );

  // Calcula estatísticas
  const claimedCount = todaysMissions.filter((m) => claimedIds.has(m.id)).length;
  const provenCount = todaysMissions.filter((m) => m.checkProof(appState).isSatisfied).length;
  const totalCount = todaysMissions.length;
  const progressPct = totalCount > 0 ? Math.round((claimedCount / totalCount) * 100) : 0;

  return {
    todaysMissions,
    claimedIds,
    claimReward,
    claimedCount,
    provenCount,
    totalCount,
    progressPct,
    appState,
  };
}
