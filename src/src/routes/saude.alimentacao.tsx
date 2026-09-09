import { createFileRoute } from "@tanstack/react-router";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { Card, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/saude/alimentacao")({
    head: () => ({
        meta: [
            { title: "Alimentação — PharmaLife" },
            {
                name: "description",
                content:
                    "Alimente seu avatar com escolhas adequadas às suas patologias e ganhe energia extra.",
            },
            { property: "og:title", content: "Alimentação — PharmaLife" },
            {
                property: "og:description",
                content: "Sugestões alimentares personalizadas conforme suas condições de saúde.",
            },
        ],
    }),
    component: Alimentacao,
});

const suggestions = [
    { emoji: "🍗", name: "Frango grelhado com legumes", tag: "Baixo sódio" },
    { emoji: "🥗", name: "Salada colorida com quinoa", tag: "Baixo índice glicêmico" },
    { emoji: "🐟", name: "Peixe assado com batata-doce", tag: "Coração saudável" },
    { emoji: "🥣", name: "Aveia com frutas vermelhas", tag: "Rico em fibras" },
];

function Alimentacao() {
    const { state, update, addPoints } = useApp();
    const meals = Object.entries(state.meals);

    const toggleMeal = (key: string) => {
        const done = state.meals[key];
        if (!done) addPoints(5);
        update({ meals: { ...state.meals, [key]: !done } });
    };

    return (
        <AppShell>
            <ScreenHeader title="Alimentação" emoji="🥕" variant="food" />

            <section className="space-y-4 px-4 py-5">
                <div>
                    <SectionTitle>Refeições de hoje</SectionTitle>
                    <div className="grid grid-cols-4 gap-2">
                        {meals.map(([name, done]) => (
                            <button
                                key={name}
                                onClick={() => toggleMeal(name)}
                                className="rounded-2xl border border-border bg-card p-2 text-center shadow-soft transition-transform active:scale-95"
                            >
                                <span className="relative inline-block text-2xl">
                                    {name === "Café da manhã"
                                        ? "🍳"
                                        : name === "Almoço"
                                            ? "🍛"
                                            : name === "Jantar"
                                                ? "🍲"
                                                : "🍎"}
                                    {done && (
                                        <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-success text-[9px] text-success-foreground">
                                            ✓
                                        </span>
                                    )}
                                </span>
                                <p className="mt-1 text-[10px] font-bold leading-tight">{name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <Card className="flex items-center gap-3 bg-gradient-move text-move-foreground">
                    <span className="text-3xl">🥑</span>
                    <p className="text-xs font-bold">
                        Arrasou na escolha! Seu avatar está feliz e cheio de energia.
                    </p>
                </Card>

                <div>
                    <SectionTitle>Sugestões para você</SectionTitle>
                    <div className="grid grid-cols-2 gap-3">
                        {suggestions.map((s) => (
                            <Card key={s.name} className="text-center">
                                <div className="text-3xl">{s.emoji}</div>
                                <p className="mt-1 text-xs font-bold leading-tight">{s.name}</p>
                                <p className="mt-1 text-[10px] text-muted-foreground">{s.tag}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                <Card className="bg-secondary text-xs font-semibold text-secondary-foreground">
                    As sugestões respeitam suas patologias cadastradas — diabetes evita doces, hipertensão
                    evita sódio e obesidade prioriza alimentos leves.
                </Card>
            </section>
        </AppShell>
    );
}
