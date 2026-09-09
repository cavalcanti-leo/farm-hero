import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Mood = "muito-feliz" | "feliz" | "normal" | "triste" | "muito-triste";

export type Medication = {
    id: string;
    name: string;
    dose: string;
    time: string;
    taken: boolean;
};

export type BloodPressure = { id: string; date: string; sys: number; dia: number; bpm: number };
export type Glucose = { id: string; date: string; value: number };
export type Activity = { id: string; type: string; minutes: number; km: number; kcal: number };

export type AvatarLook = {
    gender: "masculino" | "feminino";
    skin: string;
    hairStyle: "curto" | "medio" | "longo" | "cacheado" | "coque" | "careca";
    hairColor: string;
    outfitColor: string;
    accessory: "nenhum" | "oculos" | "bone" | "fone";
};

export type AppState = {
    look: AvatarLook;
    name: string;
    pharmacy: string;
    level: number;
    xp: number;
    xpToNext: number;
    points: number;
    energy: number;
    hunger: number;
    hydration: number;
    mood: Mood;
    streak: number;
    waterGoal: number;
    waterCups: number;
    meals: Record<string, boolean>;
    meds: Medication[];
    pressures: BloodPressure[];
    glucoses: Glucose[];
    activities: Activity[];
    symptoms: string[];
    notes: string;
    cycleDays: number[];
};

const initialState: AppState = {
    look: {
        gender: "masculino",
        skin: "#EDBA92",
        hairStyle: "curto",
        hairColor: "#2B2118",
        outfitColor: "#8B5CF6",
        accessory: "nenhum",
    },
    name: "Lucas Silva",
    pharmacy: "PharmaVida Centro",
    level: 12,
    xp: 1250,
    xpToNext: 2000,
    points: 2350,
    energy: 87,
    hunger: 62,
    hydration: 70,
    mood: "feliz",
    streak: 14,
    waterGoal: 8,
    waterCups: 5,
    meals: { "Café da manhã": true, Almoço: true, Jantar: false, Lanches: false },
    meds: [
        { id: "1", name: "Losartana 50mg", dose: "1 comprimido", time: "08:00", taken: true },
        { id: "2", name: "Metformina 850mg", dose: "1 comprimido", time: "12:00", taken: true },
        { id: "3", name: "Sinvastatina 20mg", dose: "1 comprimido", time: "20:00", taken: false },
    ],
    pressures: [
        { id: "p1", date: "14/05 · 08:20", sys: 122, dia: 80, bpm: 74 },
        { id: "p2", date: "15/05 · 08:10", sys: 118, dia: 78, bpm: 72 },
        { id: "p3", date: "16/05 · 08:05", sys: 120, dia: 79, bpm: 70 },
        { id: "p4", date: "17/05 · 08:30", sys: 124, dia: 82, bpm: 76 },
        { id: "p5", date: "18/05 · 08:15", sys: 119, dia: 78, bpm: 71 },
        { id: "p6", date: "19/05 · 08:00", sys: 121, dia: 80, bpm: 73 },
        { id: "p7", date: "20/05 · 08:30", sys: 120, dia: 80, bpm: 72 },
    ],
    glucoses: [
        { id: "g1", date: "16/05", value: 104 },
        { id: "g2", date: "17/05", value: 112 },
        { id: "g3", date: "18/05", value: 98 },
        { id: "g4", date: "19/05", value: 101 },
        { id: "g5", date: "20/05", value: 96 },
    ],
    activities: [{ id: "a1", type: "Caminhada", minutes: 30, km: 2.45, kcal: 210 }],
    symptoms: ["Tontura"],
    notes: "Senti leve tontura após tomar o medicamento de manhã.",
    cycleDays: [11, 12, 13, 14, 15, 16],
};

type Ctx = {
    state: AppState;
    update: (patch: Partial<AppState>) => void;
    addPoints: (amount: number) => void;
};

const AppContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "pharmalife-state-v1";

export function AppStateProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>(initialState);

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) setState((s) => ({ ...s, ...(JSON.parse(raw) as Partial<AppState>) }));
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            /* ignore */
        }
    }, [state]);

    const value = useMemo<Ctx>(
        () => ({
            state,
            update: (patch) => setState((s) => ({ ...s, ...patch })),
            addPoints: (amount) =>
                setState((s) => {
                    const xp = s.xp + amount;
                    const levelUp = xp >= s.xpToNext;
                    return {
                        ...s,
                        points: s.points + amount,
                        xp: levelUp ? xp - s.xpToNext : xp,
                        level: levelUp ? s.level + 1 : s.level,
                    };
                }),
        }),
        [state],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
    return ctx;
}

export const moodEmoji: Record<Mood, string> = {
    "muito-feliz": "😀",
    feliz: "🙂",
    normal: "😐",
    triste: "😔",
    "muito-triste": "😢",
};

export const moodLabel: Record<Mood, string> = {
    "muito-feliz": "Muito feliz",
    feliz: "Feliz",
    normal: "Normal",
    triste: "Triste",
    "muito-triste": "Muito triste",
};
