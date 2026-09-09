import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface WaterEntry {
  id: string;
  amountMl: number;
  time: string;
}

export interface MealEntry {
  id: string;
  name: string;
  type: "café" | "almoço" | "jantar" | "lanche";
  calories: number;
  time: string;
}

export interface ActivityEntry {
  id: string;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  time: string;
}

export interface GlucoseEntry {
  id: string;
  value: number; // mg/dL
  timing: "Jejum" | "Pré-refeição" | "Pós-refeição" | "Antes de dormir";
  time: string;
}

export interface PressureEntry {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  time: string;
}

export interface MoodEntry {
  id: string;
  mood: "Ótimo" | "Bem" | "Neutro" | "Cansado" | "Estressado";
  note: string;
  time: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  scheduledTime: string;
  taken: boolean;
}

export interface FemaleLog {
  cycleDay: number;
  flow: "Leve" | "Moderado" | "Intenso" | "Nenhum";
  symptoms: string[];
  notes: string;
}

export interface AvatarItem {
  id: string;
  name: string;
  category: "chapeu" | "roupa" | "pet" | "fundo";
  price: number;
  unlocked: boolean;
  icon: string;
  colorHex?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  completed: boolean;
  progress: number; // 0 a 100
}

interface AppState {
  // Avatar
  level: number;
  xp: number;
  maxXp: number;
  coins: number;
  streakDays: number;
  equippedHat: string | null;
  equippedOutfit: string | null;
  equippedPet: string | null;
  equippedBackground: string | null;
  items: AvatarItem[];

  // Health
  waterGoalMl: number;
  waterLogs: WaterEntry[];
  waterTimerTargetTimestamp: number | null;
  waterTimerIntervalMinutes: number;
  waterMinGoalBonusClaimed: boolean;
  waterResetDisabledUntil: number | null;
  meals: MealEntry[];
  activities: ActivityEntry[];
  glucoseLogs: GlucoseEntry[];
  pressureLogs: PressureEntry[];
  moodLogs: MoodEntry[];
  medications: MedicationItem[];
  femaleLog: FemaleLog;
  achievements: Achievement[];

  // New: Pharmacist guidance toggle
  pharmacistActive: boolean;

  // Actions
  addWater: (amountMl: number) => boolean;
  clearWaterLogs: () => void;
  setWaterTimerIntervalMinutes: (mins: number) => void;
  cancelWaterTimer: () => void;
  setWaterTimerTargetTimestamp: (timestamp: number | null) => void;
  setWaterResetDisabledUntil: (timestamp: number | null) => void;
  addMeal: (meal: Omit<MealEntry, "id" | "time">) => void;
  addActivity: (activity: Omit<ActivityEntry, "id" | "time">) => void;
  addGlucose: (glucose: Omit<GlucoseEntry, "id" | "time">) => void;
  addPressure: (pressure: Omit<PressureEntry, "id" | "time">) => void;
  addMood: (mood: Omit<MoodEntry, "id" | "time">) => void;
  addMedication: (med: Omit<MedicationItem, "id" | "taken">) => void;
  toggleMedication: (id: string) => void;
  updateFemaleLog: (log: Partial<FemaleLog>) => void;
  buyItem: (itemId: string) => boolean;
  equipItem: (category: AvatarItem["category"], itemId: string | null) => void;
  claimAchievement: (achievementId: string) => void;
  gainXpAndCoins: (xpAmount: number, coinsAmount: number, reason?: string) => void;
  setPharmacistActive: (active: boolean) => void;
}

const DEFAULT_ITEMS: AvatarItem[] = [
  { id: "hat-cap", name: "Boné Esportivo", category: "chapeu", price: 50, unlocked: true, icon: "🧢", colorHex: "#3b82f6" },
  { id: "hat-crown", name: "Coroa Dourada", category: "chapeu", price: 200, unlocked: false, icon: "👑", colorHex: "#eab308" },
  { id: "hat-headphones", name: "Fone Gamer", category: "chapeu", price: 120, unlocked: false, icon: "🎧", colorHex: "#a855f7" },
  { id: "outfit-fit", name: "Traje Fitness", category: "roupa", price: 80, unlocked: true, icon: "👕", colorHex: "#10b981" },
  { id: "outfit-armor", name: "Armadura Neon", category: "roupa", price: 300, unlocked: false, icon: "🛡️", colorHex: "#06b6d4" },
  { id: "outfit-coat", name: "Jaleco Médico", category: "roupa", price: 150, unlocked: false, icon: "🥼", colorHex: "#f43f5e" },
  { id: "pet-dog", name: "Rex (Cãozinho)", category: "pet", price: 150, unlocked: false, icon: "🐶", colorHex: "#f97316" },
  { id: "pet-cat", name: "Miau (Gatinho)", category: "pet", price: 150, unlocked: false, icon: "🐱", colorHex: "#ec4899" },
  { id: "pet-dragon", name: "Draco (Dragãozinho)", category: "pet", price: 500, unlocked: false, icon: "🐉", colorHex: "#84cc16" },
  { id: "bg-park", name: "Parque Ensolarado", category: "fundo", price: 100, unlocked: true, icon: "🌳", colorHex: "#22c55e" },
  { id: "bg-cyber", name: "Cidade Cyberpunk", category: "fundo", price: 250, unlocked: false, icon: "🌆", colorHex: "#6366f1" },
  { id: "bg-beach", name: "Praia Tropical", category: "fundo", price: 180, unlocked: false, icon: "🏖️", colorHex: "#0ea5e9" },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-water-1", title: "Mestre da Hidratação", description: "Bebeu 2.000ml de água em um dia", rewardCoins: 50, rewardXp: 100, completed: false, progress: 40 },
  { id: "ach-activity-1", title: "Primeiros Passos", description: "Completou 30 minutos de atividade física", rewardCoins: 80, rewardXp: 150, completed: false, progress: 60 },
  { id: "ach-streak-3", title: "Foco Total", description: "Mantuve uma sequência de 3 dias ativos", rewardCoins: 100, rewardXp: 200, completed: true, progress: 100 },
  { id: "ach-meds-all", title: "Pontualidade Vital", description: "Tomou todos os medicamentos do dia", rewardCoins: 60, rewardXp: 120, completed: false, progress: 50 },
  { id: "ach-mood-journal", title: "Mente Sã", description: "Registrou o humor por 5 dias seguidos", rewardCoins: 75, rewardXp: 110, completed: false, progress: 20 },
];

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "vita_hero_app_state_v1";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState<number>(3);
  const [xp, setXp] = useState<number>(150);
  const [maxXp, setMaxXp] = useState<number>(280);
  const [coins, setCoins] = useState<number>(280);
  const [streakDays, setStreakDays] = useState<number>(5);

  const [equippedHat, setEquippedHat] = useState<string | null>("hat-cap");
  const [equippedOutfit, setEquippedOutfit] = useState<string | null>("outfit-fit");
  const [equippedPet, setEquippedPet] = useState<string | null>(null);
  const [equippedBackground, setEquippedBackground] = useState<string | null>("bg-park");
  const [items, setItems] = useState<AvatarItem[]>(DEFAULT_ITEMS);

  // New state for pharmacist guidance
  const [pharmacistActive, setPharmacistActive] = useState<boolean>(false);

  const [waterGoalMl] = useState<number>(2500);
  const [waterLogs, setWaterLogs] = useState<WaterEntry[]>([
    { id: "w1", amountMl: 500, time: "08:30" },
    { id: "w2", amountMl: 300, time: "10:15" },
    { id: "w3", amountMl: 450, time: "13:00" },
  ]);

  const [meals, setMeals] = useState<MealEntry[]>([
    { id: "m1", name: "Ovos mexidos e suco verde", type: "café", calories: 350, time: "08:00" },
    { id: "m2", name: "Frango grelhado com arroz integral e salada", type: "almoço", calories: 650, time: "12:30" },
  ]);

  const [activities, setActivities] = useState<ActivityEntry[]>([
    { id: "a1", title: "Caminhada no parque", durationMinutes: 35, caloriesBurned: 180, time: "07:15" },
  ]);

  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseEntry[]>([
    { id: "g1", value: 95, timing: "Jejum", time: "07:00" },
    { id: "g2", value: 125, timing: "Pós-refeição", time: "14:00" },
  ]);

  const [pressureLogs, setPressureLogs] = useState<PressureEntry[]>([
    { id: "p1", systolic: 120, diastolic: 80, pulse: 72, time: "08:10" },
  ]);

  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([
    { id: "mo1", mood: "Bem", note: "Dia produtivo e com boa energia!", time: "09:00" },
  ]);

  const [medications, setMedications] = useState<MedicationItem[]>([
    { id: "med1", name: "Multivitamínico A-Z", dosage: "1 comprimido", scheduledTime: "08:00", taken: true },
    { id: "med2", name: "Omega 3", dosage: "1000mg", scheduledTime: "12:30", taken: true },
    { id: "med3", name: "Melatonina", dosage: "3mg", scheduledTime: "22:00", taken: false },
  ]);

  const [femaleLog, setFemaleLog] = useState<FemaleLog>({
    cycleDay: 14,
    flow: "Nenhum",
    symptoms: ["Energia alta", "Boa disposição"],
    notes: "Fase ovulatória aproximada",
  });

  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [lastWaterResetDate, setLastWaterResetDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [waterTimerTargetTimestamp, setWaterTimerTargetTimestamp] = useState<number | null>(null);
  const [waterTimerIntervalMinutes, setWaterTimerIntervalMinutes] = useState<number>(60);
  const [waterMinGoalBonusClaimed, setWaterMinGoalBonusClaimed] = useState<boolean>(false);
  const [waterResetDisabledUntil, setWaterResetDisabledUntil] = useState<number | null>(null);

  // Carregar dados salvos no localStorage se existirem
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.level) setLevel(parsed.level);
        if (parsed.xp) setXp(parsed.xp);
        if (parsed.maxXp) setMaxXp(parsed.maxXp);
        if (parsed.coins !== undefined) setCoins(parsed.coins);
        if (parsed.streakDays) setStreakDays(parsed.streakDays);
        if (parsed.equippedHat !== undefined) setEquippedHat(parsed.equippedHat);
        if (parsed.equippedOutfit !== undefined) setEquippedOutfit(parsed.equippedOutfit);
        if (parsed.equippedPet !== undefined) setEquippedPet(parsed.equippedPet);
        if (parsed.equippedBackground !== undefined) setEquippedBackground(parsed.equippedBackground);
        if (parsed.pharmacistActive !== undefined) setPharmacistActive(parsed.pharmacistActive);
        if (parsed.items) setItems(parsed.items);
        if (parsed.waterLogs) setWaterLogs(parsed.waterLogs);
        if (parsed.meals) setMeals(parsed.meals);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.glucoseLogs) setGlucoseLogs(parsed.glucoseLogs);
        if (parsed.pressureLogs) setPressureLogs(parsed.pressureLogs);
        if (parsed.moodLogs) setMoodLogs(parsed.moodLogs);
        if (parsed.medications) setMedications(parsed.medications);
        if (parsed.femaleLog) setFemaleLog(parsed.femaleLog);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.lastWaterResetDate) setLastWaterResetDate(parsed.lastWaterResetDate);
        if (parsed.waterTimerTargetTimestamp !== undefined) setWaterTimerTargetTimestamp(parsed.waterTimerTargetTimestamp);
        if (parsed.waterTimerIntervalMinutes) setWaterTimerIntervalMinutes(parsed.waterTimerIntervalMinutes);
        if (parsed.waterMinGoalBonusClaimed !== undefined) setWaterMinGoalBonusClaimed(parsed.waterMinGoalBonusClaimed);
        if (parsed.waterResetDisabledUntil !== undefined) setWaterResetDisabledUntil(parsed.waterResetDisabledUntil);
      }
    } catch (e) {
      console.error("Erro ao carregar estado local:", e);
    }
  }, []);

  // Auto resete de água ao bater 24h na vida real (00:00 meia-noite)
  useEffect(() => {
    const checkDailyReset = () => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (lastWaterResetDate && lastWaterResetDate !== todayStr) {
        setWaterLogs([]);
        setWaterTimerTargetTimestamp(null);
        setWaterMinGoalBonusClaimed(false);
        setLastWaterResetDate(todayStr);
        toast.info("🌅 Novo dia iniciado! Seu consumo diário de água foi zerado automaticamente.");
      }
    };

    checkDailyReset();
    const interval = setInterval(checkDailyReset, 15000); // Checa a cada 15s
    return () => clearInterval(interval);
  }, [lastWaterResetDate]);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      const stateToSave = {
        level, xp, maxXp, coins, streakDays,
        equippedHat, equippedOutfit, equippedPet, equippedBackground,
        items, waterLogs, meals, activities, glucoseLogs,
        pressureLogs, moodLogs, medications, femaleLog, achievements,
        lastWaterResetDate, waterTimerTargetTimestamp, waterTimerIntervalMinutes,
        waterMinGoalBonusClaimed, waterResetDisabledUntil
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Erro ao salvar estado local:", e);
    }
  }, [
    level, xp, maxXp, coins, streakDays, equippedHat, equippedOutfit,
    equippedPet, equippedBackground, items, waterLogs, meals, activities,
    glucoseLogs, pressureLogs, moodLogs, medications, femaleLog, achievements,
    lastWaterResetDate, waterTimerTargetTimestamp, waterTimerIntervalMinutes,
    waterMinGoalBonusClaimed, waterResetDisabledUntil
  ]);

  const getXpNeededForLevel = (lvl: number): number => {
    switch (lvl) {
      case 0: return 100;
      case 1: return 100;
      case 2: return 225;
      case 3: return 280;
      case 4: return 335;
      case 5: return 500;
      case 6: return 580;
      case 7: return 700;
      case 8: return 800;
      default: return 900 + (lvl - 8) * 100;
    }
  };

const getTierBonus = (lvl: number): number => {
  if (lvl <= 8) return 0.025; // Madeira
  if (lvl <= 15) return 0.05; // Prata
  if (lvl <= 25) return 0.10; // Ouro
  if (lvl <= 49) return 0.15; // Platina
  if (lvl <= 80) return 0.25; // Diamante
  return 0.35; // Hero
};

  const gainXpAndCoins = (xpAmount: number, coinsAmount: number, reason?: string) => {
    // Check if user is Top 1 (XP is higher than 80% of the next level's XP requirement)
    const currentMaxXp = getXpNeededForLevel(level);
    const isTop1 = xp > Math.round(currentMaxXp * 0.8);
    
    let finalXp = xpAmount;
    let finalCoins = coinsAmount;
    
    // Apply Top 1 bonus
    if (isTop1) {
      finalXp = Math.round(xpAmount * 1.05);
      finalCoins = Math.round(coinsAmount * 1.1);
    }

    // Apply tier bonus (percentage increase on coins)
    const tierBonus = getTierBonus(level); // e.g., 0.025 for Madeira
    const pharmacistBonus = pharmacistActive ? 0.05 : 0; // 5% extra coins if pharmacist guidance active
    finalCoins = Math.round(finalCoins * (1 + tierBonus + pharmacistBonus));

    setCoins((prev) => prev + finalCoins);
    setXp((prevXp) => {
      let newXp = prevXp + finalXp;
      let currentLevel = level;
      let targetMaxXp = getXpNeededForLevel(currentLevel);
      
      while (newXp >= targetMaxXp) {
        newXp -= targetMaxXp;
        currentLevel += 1;
        targetMaxXp = getXpNeededForLevel(currentLevel);
        
        toast.success(`🎉 PARABÉNS! Você subiu para o Nível ${currentLevel}!`, {
          description: "Você ganhou bônus de moedas e novos acessos!",
        });
      }
      
      setLevel(currentLevel);
      setMaxXp(targetMaxXp);
      return newXp;
    });

    if (reason) {
      const bonusText = isTop1 ? " (Bônus de Top 1 de +10% Moedas e +5% XP ativo!)" : "";
      toast.success(`+${finalXp} XP e +${finalCoins} Moedas!`, {
        description: `${reason}${bonusText}`,
      });
    }
  };

  const addWater = (amountMl: number): boolean => {
    const totalWater = waterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
    const newTotal = totalWater + amountMl;

    if (newTotal > 4000) {
      toast.error("🛑 Limite Máximo Saudável Atingido!", {
        description: "O limite diário máximo seguro é de 4.000ml (4 Litros). Ingerir água em excesso pode causar intoxicação por água.",
      });
      return false;
    }

    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newEntry: WaterEntry = {
      id: "w_" + Date.now(),
      amountMl,
      time: timeStr,
    };

    // Coloca IMEDIATAMENTE no contador de mL bebidos e no histórico!
    setWaterLogs((prev) => [newEntry, ...prev]);

    // Inicia o temporizador persistente com o timestamp futuro exato
    const targetTimestamp = Date.now() + waterTimerIntervalMinutes * 60 * 1000;
    setWaterTimerTargetTimestamp(targetTimestamp);

    // Concede o prêmio de 10 PONTOS (Moedas) se bateu o mínimo de 2.000 mL!
    if (newTotal >= 2000 && !waterMinGoalBonusClaimed) {
      setWaterMinGoalBonusClaimed(true);
      gainXpAndCoins(50, 10, "🏆 MÍNIMO SAUDÁVEL (2.000ml) ATINGIDO! Você ganhou 10 Pontos!");
    } else {
      gainXpAndCoins(20, 5, `Registrou +${amountMl}ml de água`);
    }

    return true;
  };

  const clearWaterLogs = () => {
    setWaterLogs([]);
    setWaterTimerTargetTimestamp(null);
    setWaterMinGoalBonusClaimed(false);
    setWaterResetDisabledUntil(Date.now() + 20 * 60 * 1000);
    toast.info("💧 Registro de água do dia e temporizador foram zerados!");
  };

  const cancelWaterTimer = () => {
    setWaterTimerTargetTimestamp(null);
    toast.warning("Temporizador de água foi cancelado. Botões liberados!");
  };

  const addMeal = (meal: Omit<MealEntry, "id" | "time">) => {
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newEntry: MealEntry = {
      ...meal,
      id: "m_" + Date.now(),
      time: timeStr,
    };
    setMeals((prev) => [newEntry, ...prev]);
    gainXpAndCoins(30, 15, `Refeição '${meal.name}' registrada`);
  };

  const addActivity = (act: Omit<ActivityEntry, "id" | "time">) => {
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newEntry: ActivityEntry = {
      ...act,
      id: "a_" + Date.now(),
      time: timeStr,
    };
    setActivities((prev) => [newEntry, ...prev]);
    gainXpAndCoins(50, 20, `Atividade '${act.title}' concluída`);
  };

  const addGlucose = (gluc: Omit<GlucoseEntry, "id" | "time">) => {
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newEntry: GlucoseEntry = {
      ...gluc,
      id: "g_" + Date.now(),
      time: timeStr,
    };
    setGlucoseLogs((prev) => [newEntry, ...prev]);
    gainXpAndCoins(25, 10, `Glicemia de ${gluc.value} mg/dL registrada`);
  };

  const addPressure = (press: Omit<PressureEntry, "id" | "time">) => {
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newEntry: PressureEntry = {
      ...press,
      id: "p_" + Date.now(),
      time: timeStr,
    };
    setPressureLogs((prev) => [newEntry, ...prev]);
    gainXpAndCoins(25, 10, `Pressão ${press.systolic}/${press.diastolic} mmHg registrada`);
  };

  const addMood = (mo: Omit<MoodEntry, "id" | "time">) => {
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newEntry: MoodEntry = {
      ...mo,
      id: "mo_" + Date.now(),
      time: timeStr,
    };
    setMoodLogs((prev) => [newEntry, ...prev]);
    gainXpAndCoins(20, 10, `Humor '${mo.mood}' registrado`);
  };

  const addMedication = (med: Omit<MedicationItem, "id" | "taken">) => {
    const newEntry: MedicationItem = {
      ...med,
      id: "med_" + Date.now(),
      taken: false,
    };
    setMedications((prev) => [...prev, newEntry]);
    toast.success(`Medicamento ${med.name} adicionado!`);
  };

  const toggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.taken;
          if (nextState) {
            gainXpAndCoins(35, 15, `Tomou ${item.name}`);
          }
          return { ...item, taken: nextState };
        }
        return item;
      })
    );
  };

  const updateFemaleLog = (logPartial: Partial<FemaleLog>) => {
    setFemaleLog((prev) => ({ ...prev, ...logPartial }));
    toast.success("Registro de saúde feminina atualizado!");
  };

  const buyItem = (itemId: string): boolean => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return false;
    if (item.unlocked) {
      toast.info("Você já possui este item!");
      return true;
    }
    if (coins < item.price) {
      toast.error("Moedas insuficientes!", {
        description: `Você precisa de ${item.price} moedas, mas possui ${coins}.`,
      });
      return false;
    }

    setCoins((prev) => prev - item.price);
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, unlocked: true } : i))
    );
    toast.success(`🛍️ Você comprou '${item.name}'!`, {
      description: "Acesse a aba de Personalização para equipar seu item.",
    });
    return true;
  };

  const equipItem = (category: AvatarItem["category"], itemId: string | null) => {
    if (category === "chapeu") setEquippedHat(itemId);
    if (category === "roupa") setEquippedOutfit(itemId);
    if (category === "pet") setEquippedPet(itemId);
    if (category === "fundo") setEquippedBackground(itemId);
    toast.success("Avatar atualizado com sucesso!");
  };

  const claimAchievement = (achievementId: string) => {
    const ach = achievements.find((a) => a.id === achievementId);
    if (!ach || ach.completed) return;

    setAchievements((prev) =>
      prev.map((a) => (a.id === achievementId ? { ...a, completed: true } : a))
    );
    gainXpAndCoins(ach.rewardXp, ach.rewardCoins, `Conquista '${ach.title}' desbloqueada!`);
  };

  return (
    <AppContext.Provider
      value={{
        level,
        xp,
        maxXp,
        coins,
        streakDays,
        equippedHat,
        equippedOutfit,
        equippedPet,
        equippedBackground,
        items,
        waterGoalMl,
        waterLogs,
        waterTimerTargetTimestamp,
        waterTimerIntervalMinutes,
        waterResetDisabledUntil,
        waterMinGoalBonusClaimed,
        meals,
        activities,
        glucoseLogs,
        pressureLogs,
        moodLogs,
        medications,
        femaleLog,
        achievements,
        addWater,
        clearWaterLogs,
        setWaterTimerIntervalMinutes,
        cancelWaterTimer,
        setWaterTimerTargetTimestamp,
        setWaterResetDisabledUntil,
        addMeal,
        addActivity,
        addGlucose,
        addPressure,
        addMood,
        addMedication,
        toggleMedication,
        updateFemaleLog,
        buyItem,
        equipItem,
        claimAchievement,
        pharmacistActive,
        setPharmacistActive,
        gainXpAndCoins,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState deve ser usado dentro de um AppProvider");
  }
  return context;
};
