import { createFileRoute } from "@tanstack/react-router";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { Card, PillButton } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/saude/feminina")({
    head: () => ({
        meta: [
            { title: "Saúde Feminina — PharmaLife" },
            {
                name: "description",
                content: "Calendário menstrual com registro de TPM, fluxo, ovulação e fertilidade.",
            },
            { property: "og:title", content: "Saúde Feminina — PharmaLife" },
            {
                property: "og:description",
                content: "Acompanhe seu ciclo, sintomas e período fértil em um calendário simples.",
            },
        ],
    }),
    component: Feminina,
});

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

function Feminina() {
    const { state, update, addPoints } = useApp();
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const fertile = [19, 20, 21, 22];

    const toggleDay = (d: number) => {
        update({
            cycleDays: state.cycleDays.includes(d)
                ? state.cycleDays.filter((x) => x !== d)
                : [...state.cycleDays, d],
        });
        addPoints(5);
    };

    return (
        <AppShell>
            <ScreenHeader title="Saúde Feminina" emoji="🌸" variant="femme" />

            <section className="space-y-4 px-4 py-4">
                <Card>
                    <p className="text-center text-sm font-bold">Maio 2026</p>
                    <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                        {weekDays.map((d, i) => (
                            <span key={i} className="text-[10px] font-bold text-muted-foreground">
                                {d}
                            </span>
                        ))}
                        {days.map((d) => {
                            const isPeriod = state.cycleDays.includes(d);
                            const isFertile = fertile.includes(d);
                            return (
                                <button
                                    key={d}
                                    onClick={() => toggleDay(d)}
                                    className={
                                        isPeriod
                                            ? "aspect-square rounded-full bg-gradient-med text-xs font-bold text-primary-foreground"
                                            : isFertile
                                                ? "aspect-square rounded-full bg-secondary text-xs font-bold text-secondary-foreground"
                                                : "aspect-square rounded-full text-xs font-semibold text-foreground"
                                    }
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-3 flex flex-wrap justify-center gap-3 text-[10px] font-semibold text-muted-foreground">
                        <Legend color="var(--med)" label="Menstruação" />
                        <Legend color="var(--femme)" label="TPM" />
                        <Legend color="var(--water)" label="Ovulação" />
                        <Legend color="var(--primary)" label="Fértil" />
                    </div>
                </Card>

                <PillButton variant="med">🌸 Registrar menstruação</PillButton>
                <PillButton variant="soft">❤️ Registrar coito</PillButton>
                <PillButton variant="soft">💊 Anticoncepcional de hoje</PillButton>
            </section>
        </AppShell>
    );
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
        </span>
    );
}
