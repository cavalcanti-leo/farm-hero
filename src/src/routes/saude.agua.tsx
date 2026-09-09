import { createFileRoute } from "@tanstack/react-router";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { Card, PillButton } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/saude/agua")({
    head: () => ({
        meta: [
            { title: "Hidratação — PharmaLife" },
            {
                name: "description",
                content: "Registre seus copos de água e cumpra a meta diária calculada pelo seu peso.",
            },
            { property: "og:title", content: "Hidratação — PharmaLife" },
            {
                property: "og:description",
                content: "Seu avatar precisa de água: registre cada copo e ganhe pontos.",
            },
        ],
    }),
    component: Agua,
});

function Agua() {
    const { state, update, addPoints } = useApp();
    const pct = Math.round((state.waterCups / state.waterGoal) * 100);
    const remaining = Math.max(0, state.waterGoal - state.waterCups);

    const addCup = () => {
        if (state.waterCups >= state.waterGoal) return;
        update({ waterCups: state.waterCups + 1 });
        addPoints(5);
    };

    return (
        <AppShell>
            <ScreenHeader title="Água" emoji="💧" variant="water" />

            <section className="space-y-4 px-4 py-5">
                <Card className="flex flex-col items-center">
                    <div
                        className="flex size-44 items-center justify-center rounded-full"
                        style={{
                            background: `conic-gradient(var(--water) ${pct * 3.6}deg, var(--muted) 0deg)`,
                        }}
                    >
                        <div className="flex size-36 flex-col items-center justify-center rounded-full bg-card">
                            <span className="text-3xl">💧</span>
                            <p className="text-2xl font-bold text-water">
                                {state.waterCups} / {state.waterGoal}
                            </p>
                            <p className="text-xs text-muted-foreground">copos</p>
                        </div>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-muted-foreground">
                        {remaining > 0
                            ? `Faltam ${remaining} copos para sua meta!`
                            : "Meta concluída! Avatar hidratado 🎉"}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {Array.from({ length: state.waterGoal }).map((_, i) => (
                            <span
                                key={i}
                                className={
                                    i < state.waterCups
                                        ? "text-2xl opacity-100"
                                        : "text-2xl opacity-25 grayscale"
                                }
                            >
                                🥤
                            </span>
                        ))}
                    </div>
                </Card>

                <PillButton variant="water" onClick={addCup}>
                    ＋ Registrar copo
                </PillButton>

                <Card className="bg-secondary text-xs font-semibold text-secondary-foreground">
                    💡 Dica: hidrate-se ao longo do dia para mais disposição. Sua meta é calculada a partir do
                    seu peso corporal.
                </Card>
            </section>
        </AppShell>
    );
}
