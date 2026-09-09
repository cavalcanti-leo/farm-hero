import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { Card, Disclaimer, PillButton, Segmented } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/saude/pressao")({
    head: () => ({
        meta: [
            { title: "Pressão Arterial — PharmaLife" },
            {
                name: "description",
                content: "Registre PAS, PAD e frequência cardíaca e acompanhe gráficos de tendência.",
            },
            { property: "og:title", content: "Pressão Arterial — PharmaLife" },
            {
                property: "og:description",
                content: "Padrões alterados geram alerta automático ao seu farmacêutico.",
            },
        ],
    }),
    component: Pressao,
});

function Pressao() {
    const { state, update, addPoints } = useApp();
    const [range, setRange] = useState<"Semana" | "Mês" | "Ano">("Semana");
    const last = state.pressures[state.pressures.length - 1];
    const avgSys = Math.round(
        state.pressures.reduce((a, b) => a + b.sys, 0) / state.pressures.length,
    );
    const avgDia = Math.round(
        state.pressures.reduce((a, b) => a + b.dia, 0) / state.pressures.length,
    );

    const data = state.pressures.map((p) => ({
        name: p.date.split(" ")[0],
        PAS: p.sys,
        PAD: p.dia,
    }));

    const register = () => {
        update({
            pressures: [
                ...state.pressures,
                {
                    id: crypto.randomUUID(),
                    date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
                    sys: 120,
                    dia: 80,
                    bpm: 72,
                },
            ],
        });
        addPoints(15);
    };

    return (
        <AppShell>
            <ScreenHeader title="Pressão Arterial" emoji="❤️" variant="primary" />

            <section className="space-y-4 px-4 py-4">
                <Segmented options={["Semana", "Mês", "Ano"] as const} value={range} onChange={setRange} />

                <Card className="text-center">
                    <p className="text-3xl font-bold">
                        {last.sys} / {last.dia}{" "}
                        <span className="text-sm font-semibold text-muted-foreground">mmHg</span>
                    </p>
                    <p className="mt-1 inline-block rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground">
                        Normal
                    </p>
                    <div className="mt-3 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis domain={[40, 160]} tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="PAS" stroke="var(--success)" strokeWidth={3} />
                                <Line type="monotone" dataKey="PAD" stroke="var(--med)" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="grid grid-cols-3 gap-2">
                    <Card className="p-3 text-center">
                        <p className="text-[10px] text-muted-foreground">Média</p>
                        <p className="text-sm font-bold">
                            {avgSys} / {avgDia}
                        </p>
                    </Card>
                    <Card className="p-3 text-center">
                        <p className="text-[10px] text-muted-foreground">Frequência</p>
                        <p className="text-sm font-bold">{last.bpm} bpm</p>
                    </Card>
                    <Card className="p-3 text-center">
                        <p className="text-[10px] text-muted-foreground">Última</p>
                        <p className="text-sm font-bold">{last.date}</p>
                    </Card>
                </div>

                <PillButton onClick={register}>＋ Nova medição</PillButton>
                <Disclaimer />
            </section>
        </AppShell>
    );
}
