import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { Card, Disclaimer, PillButton, Segmented } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/saude/medicamentos")({
    head: () => ({
        meta: [
            { title: "Medicamentos — PharmaLife" },
            {
                name: "description",
                content: "Acompanhe doses, horários e histórico de adesão dos seus medicamentos.",
            },
            { property: "og:title", content: "Medicamentos — PharmaLife" },
            {
                property: "og:description",
                content: "Marque cada dose tomada, ganhe pontos e mantenha sua adesão em dia.",
            },
        ],
    }),
    component: Medicamentos,
});

function Medicamentos() {
    const { state, update, addPoints } = useApp();
    const [tab, setTab] = useState<"Hoje" | "Histórico">("Hoje");
    const next = state.meds.find((m) => !m.taken);

    const toggle = (id: string) => {
        const med = state.meds.find((m) => m.id === id);
        if (med && !med.taken) addPoints(10);
        update({
            meds: state.meds.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)),
        });
    };

    return (
        <AppShell>
            <ScreenHeader title="Medicamentos" emoji="💊" variant="med" />

            <section className="space-y-3 px-4 py-4">
                <Segmented options={["Hoje", "Histórico"] as const} value={tab} onChange={setTab} />

                {tab === "Hoje" ? (
                    <>
                        {state.meds.map((m) => (
                            <Card key={m.id} className="flex items-center gap-3">
                                <span className="text-2xl">💊</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">{m.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {m.time} · {m.dose}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggle(m.id)}
                                    aria-label={m.taken ? "Desmarcar dose" : "Marcar dose como tomada"}
                                    className={
                                        m.taken
                                            ? "flex size-8 items-center justify-center rounded-full bg-success text-success-foreground"
                                            : "flex size-8 items-center justify-center rounded-full border-2 border-border text-muted-foreground"
                                    }
                                >
                                    ✓
                                </button>
                            </Card>
                        ))}

                        {next && (
                            <Card className="bg-gradient-med text-primary-foreground">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] opacity-90">Próxima dose</p>
                                        <p className="text-sm font-bold">{next.name}</p>
                                        <p className="text-xs opacity-90">{next.time}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] opacity-90">Faltam</p>
                                        <p className="text-2xl font-bold">02:15</p>
                                    </div>
                                </div>
                                <PillButton
                                    variant="soft"
                                    className="mt-3"
                                    onClick={() => toggle(next.id)}
                                >
                                    ＋ Marcar como tomado
                                </PillButton>
                            </Card>
                        )}
                    </>
                ) : (
                    <Card>
                        <p className="text-sm font-bold">Adesão dos últimos 7 dias</p>
                        <ul className="mt-3 space-y-2 text-xs">
                            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d, i) => (
                                <li key={d} className="flex items-center gap-3">
                                    <span className="w-8 font-bold text-muted-foreground">{d}</span>
                                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-gradient-med"
                                            style={{ width: `${[100, 100, 66, 100, 100, 66, 100][i]}%` }}
                                        />
                                    </div>
                                    <span className="w-10 text-right font-bold">
                                        {[100, 100, 66, 100, 100, 66, 100][i]}%
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}

                <Disclaimer />
            </section>
        </AppShell>
    );
}
