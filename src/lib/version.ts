/**
 * FarmHero Version & Auto-Reset Manager
 * ─────────────────────────────────────────────────────────────────
 * Gerencia a versão do aplicativo (ex: Beta 0.2 -> Beta 0.3).
 * Sempre que houver uma atualização de versão:
 * 1. Exibe um banner de alerta fixo com contagem regressiva de 5 segundos.
 * 2. Ao zerar a contagem, faz um RESET TOTAL dos dados (níveis, XP, moedas, itens, logs).
 * 3. Salva a nova versão no localStorage.
 * 4. Adiciona o registro da atualização nas notificações/avisos do app.
 */

import { useState, useEffect } from "react";

export const APP_VERSION = "Beta 0.3";
export const PREVIOUS_VERSION_DEFAULT = "Beta 0.2";
export const VERSION_KEY = "farmhero_app_version";
export const VERSION_LOGS_KEY = "farmhero_version_history";

export interface VersionLog {
  id: string;
  fromVersion: string;
  toVersion: string;
  timestamp: string;
  desc: string;
}

export function getStoredVersion(): string | null {
  try {
    return localStorage.getItem(VERSION_KEY);
  } catch {
    return null;
  }
}

export function getVersionHistory(): VersionLog[] {
  try {
    const raw = localStorage.getItem(VERSION_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_err) {
    // Ignore storage error
  }
  return [
    {
      id: "v-03",
      fromVersion: "Beta 0.2",
      toVersion: "Beta 0.3",
      timestamp: new Date().toISOString(),
      desc: "Atualização Gigante: Novas missões diárias com comprovante real, central de recompensas e reset completo de dados de teste.",
    },
  ];
}

/**
 * Perform a complete reset of all local storage and application state.
 */
export function executeFullReset(
  newVersion: string = APP_VERSION,
  fromVer: string = PREVIOUS_VERSION_DEFAULT,
) {
  try {
    // Preserva histórico de versões
    const history = getVersionHistory();
    const newLog: VersionLog = {
      id: `v-${Date.now()}`,
      fromVersion: fromVer,
      toVersion: newVersion,
      timestamp: new Date().toISOString(),
      desc: `Atualização Gigante: ${fromVer} ➔ ${newVersion}. Reset completo de Nível, XP, Moedas, Itens e Histórico aplicado!`,
    };
    const updatedHistory = [newLog, ...history];

    // Limpa tudo do localStorage
    localStorage.clear();

    // Salva novamente a versão e o histórico atualizados
    localStorage.setItem(VERSION_KEY, newVersion);
    localStorage.setItem(VERSION_LOGS_KEY, JSON.stringify(updatedHistory));
  } catch (err) {
    console.error("Erro ao executar reset completo:", err);
  }

  // Recarrega a página para aplicar o reset em toda a memória da aplicação
  window.location.reload();
}

/**
 * Hook para monitorar atualizações de versão e gerenciar o modal de 5s de reset
 */
export function useVersionUpdateManager() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [fromVersion, setFromVersion] = useState(PREVIOUS_VERSION_DEFAULT);
  const [toVersion, setToVersion] = useState(APP_VERSION);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const stored = getStoredVersion();

    // Se não há versão salva ou a versão é diferente da atual
    if (!stored || stored !== APP_VERSION) {
      const prev = stored || PREVIOUS_VERSION_DEFAULT;
      setFromVersion(prev);
      setToVersion(APP_VERSION);
      setShowUpdateModal(true);
      setCountdown(5);
    }
  }, []);

  // Intervalo de contagem regressiva de 5 segundos
  useEffect(() => {
    if (!showUpdateModal) return;

    if (countdown <= 0) {
      // Quando a contagem chega a 0, executa o reset total!
      executeFullReset(toVersion, fromVersion);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showUpdateModal, countdown, toVersion, fromVersion]);

  // Função manual para forçar uma nova atualização (ex: Beta 0.2 -> Beta 0.3)
  const triggerManualUpdate = (newVer: string) => {
    const currentVer = getStoredVersion() || APP_VERSION;
    setFromVersion(currentVer);
    setToVersion(newVer);
    setShowUpdateModal(true);
    setCountdown(5);
  };

  return {
    showUpdateModal,
    countdown,
    fromVersion,
    toVersion,
    triggerManualUpdate,
    versionHistory: getVersionHistory(),
  };
}
