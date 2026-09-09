import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, Disclaimer, SectionTitle } from "@/components/ui-kit";

export const Route = createFileRoute("/saude/")({
    head: () => ({
        meta: [
            { title: "Saúde — PharmaLife" },
            {
                name: "description",
                content:
                    "Central de saúde: medicamentos, água, alimentação, atividade física, pressão, glicemia, humor e saúde feminina.",
            },
            { property: "og:title", content: "Saúde — PharmaLife" },
            {
                property: "og:description",
                content: "Registre e acompanhe todos os seus indicadores de saúde em um só lugar.",
            },
        ],
    }),
    component: SaudeHub,
});

const modules = [
    { to: "/saude/medicamentos", emoji: "💊", title: "Medicamentos", hint: "Doses e lembretes" },
    { to: "/saude/agua", emoji: "💧", title: "Água", hint: "Meta de hidratação" },
    { to: "/saude/alimentacao", emoji: "🥗", title: "Alimentação", hint: "Refeições do dia" },
    { to: "/saude/atividade", emoji: "👟", title: "Atividade física", hint: "Passos e treinos" },
    { to: "/saude/pressao", emoji: "❤️", title: "Pressão arterial", hint: "PAS / PAD / bpm" },
    { to: "/saude/glicemia", emoji: "🩸", title: "Glicemia", hint: "Tendência semanal" },
    { to: "/saude/humor", emoji: "🙂", title: "Humor e sintomas", hint: "Registro diário" },
    { to: "/saude/feminina", emoji: "🌸", title: "Saúde feminina", hint: "Ciclo e fertilidade" },
] as const;

function SaudeHub() {
    return (
        <AppShell>
            <header className="sticky top-0 z-30 rounded-b-3xl bg-gradient-primary px-4 py-5 text-primary-foreground shadow-soft">
                <h1 className="text-center text-xl font-bold">Minha Saúde 💚</h1>
                <p className="mt-1 text-center text-xs opacity-90">
                    Cada registro vira pontos e deixa seu avatar mais forte
                </p>
            </header>

            <section className="space-y-3 px-4 py-5">
                <SectionTitle>Módulos</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                    {modules.map((m) => (
                        <Link key={m.to} to={m.to}>
                            <Card className="h-full text-center transition-transform active:scale-[0.97]">
                                <div className="text-3xl">{m.emoji}</div>
                                <p className="mt-1 text-sm font-bold">{m.title}</p>
                                <p className="text-[11px] text-muted-foreground">{m.hint}</p>
                            </Card>
                        </Link>
                    ))}
                </div>

                <Card className="bg-secondary">
                    <p className="text-sm font-bold">🤖 IA Clínica</p>
                    <p className="mt-1 text-xs text-secondary-foreground">
                        Sua adesão está em 92% nesta semana. Continue tomando a Sinvastatina às 20:00 para
                        manter o combo. Relate qualquer tontura ao seu farmacêutico.
                    </p>
                </Card>

                <Disclaimer />
            </section>
        </AppShell>
    );
}
