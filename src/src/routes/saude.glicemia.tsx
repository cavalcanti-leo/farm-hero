import { createFileRoute } from "@tanstack/react-router";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { Card, Disclaimer, PillButton } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/saude/glicemia")({
    head: () => ({
        meta: [
            { title: "Glicemia — PharmaLife" },
            {
                name: "description",
                content: "Registro diário de glicemia com gráficos e identificação de tendências.",
            },
            { property: "og:title", content: "Glicemia — PharmaLife" },
            {
                property: "og:description",
                content: "Veja se sua glicemia está em tendência de melhora ou piora.",
            },
        ],
    }),
    component: Glicemia,
});

function Glicemia() {
    const { state, update, addPoints } = useApp();
    const values = state.glucoses;
    const last = values[values.length - 1];
    const trend = last.value <= values[0].value ? "melhora" : "atenção";

    const register = () => {
        update({
            glucoses: [
                ...values,
                {
                    id: crypto.randomUUID(),
                    date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
                    value: 99,
                },
            ],
        });
        addPoints(15);
    };

    return (
        <AppShell>
            <ScreenHeader title="Glicemia" emoji="🩸" variant="med" />

            <section className="space-y-4 px-4 py-4">
                <Card className="text-center">
                    <p className="text-3xl font-bold">
                        {last.value} <span className="text-sm text-muted-foreground">mg/dL</span>
                    </p>
                    <p className="mt-1 inline-block rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground">
                        Tendência de {trend}
                    </p>
                    <div className="mt-3 h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={values.map((g) => ({ name: g.date, valor: g.value }))}
                                margin={{ left: -20, right: 8, top: 8 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis domain={[60, 160]} tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Bar dataKey="valor" fill="var(--med)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <PillButton variant="med" onClick={register}>
                    ＋ Registrar glicemia
                </PillButton>
                <Disclaimer />
            </section>
        </AppShell>
    );
}
