import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { Card, PillButton, ProgressBar, Segmented } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/saude/atividade")({
    head: () => ({
        meta: [
            { title: "Atividade Física — PharmaLife" },
            {
                name: "description",
                content: "Registre caminhadas, corridas e treinos, e melhore o condicionamento do avatar.",
            },
            { property: "og:title", content: "Atividade Física — PharmaLife" },
            {
                property: "og:description",
                content: "Minutos, distância e calorias viram XP para o seu avatar.",
            },
        ],
    }),
    component: Atividade,
});

const types = [
    { emoji: "🚶", label: "Caminhada" },
    { emoji: "🏃", label: "Corrida" },
    { emoji: "🚴", label: "Bicicleta" },
    { emoji: "🏋️", label: "Academia" },
];

function Atividade() {
    const { state, update, addPoints } = useApp();
    const [range, setRange] = useState<"Hoje" | "Semana" | "Mês">("Hoje");
    const [selected, setSelected] = useState("Caminhada");

    const totals = state.activities.reduce(
        (acc, a) => ({
            minutes: acc.minutes + a.minutes,
            km: acc.km + a.km,
            kcal: acc.kcal + a.kcal,
        }),
        { minutes: 0, km: 0, kcal: 0 },
    );

    const register = () => {
        update({
            activities: [
                ...state.activities,
                {
                    id: crypto.randomUUID(),
                    type: selected,
                    minutes: 15,
                    km: 1.2,
                    kcal: 90,
                },
            ],
        });
        addPoints(20);
    };

    return (
        <AppShell>
            <ScreenHeader title="Atividade Física" emoji="👟" variant="move" />

            <section className="space-y-4 px-4 py-4">
                <Segmented options={["Hoje", "Semana", "Mês"] as const} value={range} onChange={setRange} />

                <Card className="bg-gradient-move text-move-foreground">
                    <div className="flex items-center justify-around">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{totals.km.toFixed(2)}</p>
                            <p className="text-[11px] font-semibold">km</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{totals.minutes}</p>
                            <p className="text-[11px] font-semibold">min</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{totals.kcal}</p>
                            <p className="text-[11px] font-semibold">kcal</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <div className="flex-1">
                            <p className="text-sm font-bold">Meta diária</p>
                            <p className="text-xs text-muted-foreground">{totals.minutes} / 60 min</p>
                        </div>
                    </div>
                    <ProgressBar
                        value={(totals.minutes / 60) * 100}
                        className="mt-2"
                        barClassName="bg-gradient-move"
                    />
                </Card>

                <div className="grid grid-cols-4 gap-2">
                    {types.map((t) => (
                        <button
                            key={t.label}
                            onClick={() => setSelected(t.label)}
                            className={
                                selected === t.label
                                    ? "rounded-2xl bg-gradient-move p-3 text-center text-move-foreground shadow-pop"
                                    : "rounded-2xl border border-border bg-card p-3 text-center shadow-soft"
                            }
                        >
                            <span className="text-2xl">{t.emoji}</span>
                            <p className="mt-1 text-[10px] font-bold">{t.label}</p>
                        </button>
                    ))}
                </div>

                <PillButton variant="move" onClick={register}>
                    ⭐ Registrar atividade
                </PillButton>

                <Card className="bg-secondary text-xs font-semibold text-secondary-foreground">
                    Em breve: sincronização com Google Fit, Apple Health, Samsung Health e Garmin.
                </Card>
            </section>
        </AppShell>
    );
}
