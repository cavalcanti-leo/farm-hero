import { createFileRoute } from "@tanstack/react-router";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { Card, Chip, Disclaimer, PillButton, SectionTitle } from "@/components/ui-kit";
import { useApp, moodEmoji, moodLabel, type Mood } from "@/lib/app-state";

export const Route = createFileRoute("/saude/humor")({
    head: () => ({
        meta: [
            { title: "Humor e Sintomas — PharmaLife" },
            {
                name: "description",
                content: "Registre seu humor diário, sintomas e reações à medicação para o farmacêutico.",
            },
            { property: "og:title", content: "Humor e Sintomas — PharmaLife" },
            {
                property: "og:description",
                content: "Como você está hoje? Seu registro ajuda no acompanhamento farmacêutico.",
            },
        ],
    }),
    component: Humor,
});

const moods: Mood[] = ["muito-feliz", "feliz", "normal", "triste", "muito-triste"];
const symptomList = [
    "Dor de cabeça",
    "Náusea",
    "Tontura",
    "Cansaço",
    "Sonolência",
    "Ansiedade",
    "Dor abdominal",
    "Reação à medicação",
];

function Humor() {
    const { state, update, addPoints } = useApp();

    const toggleSymptom = (s: string) =>
        update({
            symptoms: state.symptoms.includes(s)
                ? state.symptoms.filter((x) => x !== s)
                : [...state.symptoms, s],
        });

    return (
        <AppShell>
            <ScreenHeader title="Humor e Sintomas" emoji="☁️" variant="water" />

            <section className="space-y-4 px-4 py-4">
                <Card>
                    <SectionTitle>Como você está hoje?</SectionTitle>
                    <div className="flex justify-between">
                        {moods.map((m) => (
                            <button
                                key={m}
                                onClick={() => {
                                    if (state.mood !== m) addPoints(5);
                                    update({ mood: m });
                                }}
                                className={
                                    state.mood === m
                                        ? "flex w-14 flex-col items-center gap-1 rounded-2xl bg-secondary p-2 ring-2 ring-primary"
                                        : "flex w-14 flex-col items-center gap-1 rounded-2xl p-2"
                                }
                            >
                                <span className="text-2xl">{moodEmoji[m]}</span>
                                <span className="text-[9px] font-bold leading-tight text-muted-foreground">
                                    {moodLabel[m]}
                                </span>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card>
                    <SectionTitle>Sintomas</SectionTitle>
                    <div className="flex flex-wrap gap-2">
                        {symptomList.map((s) => (
                            <Chip
                                key={s}
                                active={state.symptoms.includes(s)}
                                onClick={() => toggleSymptom(s)}
                            >
                                {s}
                            </Chip>
                        ))}
                    </div>
                </Card>

                <Card>
                    <SectionTitle>Observações</SectionTitle>
                    <textarea
                        value={state.notes}
                        onChange={(e) => update({ notes: e.target.value })}
                        rows={3}
                        className="w-full resize-none rounded-2xl bg-muted p-3 text-xs font-semibold outline-none"
                        placeholder="Conte como foi seu dia..."
                    />
                </Card>

                <PillButton variant="water" onClick={() => addPoints(10)}>
                    ✓ Salvar registro do dia
                </PillButton>
                <Disclaimer />
            </section>
        </AppShell>
    );
}
