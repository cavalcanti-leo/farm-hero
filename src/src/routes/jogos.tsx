import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/jogos")({
    head: () => ({
        meta: [
            { title: "Jogos — PharmaLife" },
            {
                name: "description",
                content: "Mini games cognitivos e de relaxamento que rendem XP para o seu avatar.",
            },
            { property: "og:title", content: "Jogos — PharmaLife" },
            {
                property: "og:description",
                content: "Memória, sudoku, quebra-cabeça e respiração guiada: treine a mente e ganhe XP.",
            },
        ],
    }),
    component: Jogos,
});

const games = [
    { emoji: "🧠", name: "Memória Farma", hint: "Melhore sua memória!", xp: 50 },
    { emoji: "🧩", name: "Quebra-Cabeça", hint: "Monte as peças!", xp: 40 },
    { emoji: "🎨", name: "Color Match", hint: "Combine as cores!", xp: 30 },
    { emoji: "🔢", name: "Sudoku", hint: "Desafie sua lógica!", xp: 45 },
    { emoji: "🌬️", name: "Respiração Guiada", hint: "Relaxe e respire!", xp: 25 },
    { emoji: "🔤", name: "Caça-Palavras", hint: "Encontre os termos!", xp: 35 },
];

function Jogos() {
    const { addPoints } = useApp();

    return (
        <AppShell>
            <header className="sticky top-0 z-30 rounded-b-3xl bg-gradient-primary px-4 py-5 text-primary-foreground shadow-soft">
                <h1 className="text-center text-xl font-bold">Jogos 🎮</h1>
                <p className="mt-1 text-center text-xs opacity-90">Treine sua mente e ganhe pontos!</p>
            </header>

            <section className="space-y-3 px-4 py-5">
                {games.map((g) => (
                    <Card key={g.name} className="flex items-center gap-3">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
                            {g.emoji}
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-bold">{g.name}</p>
                            <p className="text-xs text-muted-foreground">{g.hint}</p>
                            <p className="text-[11px] font-bold text-primary">+{g.xp} XP</p>
                        </div>
                        <button
                            onClick={() => addPoints(g.xp)}
                            className="rounded-2xl bg-gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-pop active:scale-95"
                        >
                            Jogar
                        </button>
                    </Card>
                ))}
            </section>
        </AppShell>
    );
}
