import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PillButton, ProgressBar } from "@/components/ui-kit";
import { useApp, moodEmoji, moodLabel } from "@/lib/app-state";
import { AvatarFigure } from "@/components/AvatarFigure";

export const Route = createFileRoute("/avatar")({
    head: () => ({
        meta: [
            { title: "Meu Avatar — PharmaLife" },
            {
                name: "description",
                content:
                    "Veja a evolução do seu avatar: energia, fome, hidratação e humor mudam conforme seus hábitos de saúde.",
            },
            { property: "og:title", content: "Meu Avatar — PharmaLife" },
            {
                property: "og:description",
                content: "Seu avatar evolui conforme você cuida da sua saúde todos os dias.",
            },
        ],
    }),
    component: AvatarPage,
});

const stages = [
    "Muito abaixo do peso",
    "Magro",
    "Peso adequado",
    "Sobrepeso",
    "Obesidade Grau I",
    "Obesidade Grau II",
];

function AvatarPage() {
    const { state } = useApp();

    return (
        <AppShell>
            <header className="sticky top-0 z-30 flex items-center gap-3 rounded-b-3xl bg-gradient-primary px-4 py-4 text-primary-foreground shadow-soft">
                <span className="flex size-9 items-center justify-center rounded-full bg-card/25">🧑</span>
                <h1 className="flex-1 text-center text-xl font-bold">Meu Avatar</h1>
                <Link
                    to="/personalizar-avatar"
                    aria-label="Editar avatar"
                    className="flex size-9 items-center justify-center rounded-full bg-card/25 active:scale-95"
                >
                    ✏️
                </Link>
            </header>

            <section className="grid grid-cols-[1.4fr_1fr] gap-3 px-4 py-4">
                <Link
                    to="/personalizar-avatar"
                    aria-label="Personalizar avatar"
                    className="sticker relative flex items-end justify-center overflow-hidden rounded-[1.75rem] bg-gradient-primary p-3 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                    <AvatarFigure look={state.look} className="h-64 animate-bob drop-shadow-2xl" />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-card px-3 py-1 text-[11px] font-extrabold text-foreground">
                        🎨 Personalizar
                    </span>
                </Link>
                <div className="space-y-2.5">
                    <VitalCard emoji="⚡" label="Energia" value={state.energy} />
                    <VitalCard emoji="🍗" label="Fome" value={state.hunger} />
                    <VitalCard emoji="💧" label="Hidratação" value={state.hydration} />
                    <Card className="p-3">
                        <p className="text-xs font-bold">
                            {moodEmoji[state.mood]} Humor
                        </p>
                        <p className="mt-1 rounded-xl bg-secondary px-2 py-1 text-center text-xs font-bold text-secondary-foreground">
                            {moodLabel[state.mood]}
                        </p>
                    </Card>
                </div>
            </section>

            <section className="space-y-3 px-4 pb-6">
                <Link to="/personalizar-avatar" className="block">
                    <PillButton variant="primary">🎽 Personalizar</PillButton>
                </Link>
                <PillButton variant="soft">✨ Ver evolução</PillButton>

                <Card>
                    <p className="text-sm font-bold">Fases de evolução</p>
                    <ul className="mt-2 space-y-2">
                        {stages.map((s, i) => (
                            <li key={s} className="flex items-center gap-2 text-xs">
                                <span
                                    className={
                                        i === 2
                                            ? "flex size-6 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-bold text-primary-foreground"
                                            : "flex size-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground"
                                    }
                                >
                                    {i + 1}
                                </span>
                                <span className={i === 2 ? "font-bold text-primary" : "text-muted-foreground"}>
                                    {s}
                                </span>
                                {i === 2 && (
                                    <span className="ml-auto rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
                                        atual
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card className="bg-secondary">
                    <p className="text-sm font-bold">Como seu avatar reage</p>
                    <p className="mt-1 text-xs text-secondary-foreground">
                        Hábitos melhores rendem músculos, postura, roupas e animações felizes. Hábitos piores
                        deixam o avatar cansado, sonolento e com aparência menos saudável.
                    </p>
                </Card>
            </section>
        </AppShell>
    );
}

function VitalCard({ emoji, label, value }: { emoji: string; label: string; value: number }) {
    return (
        <Card className="p-3">
            <p className="text-xs font-bold">
                {emoji} {label}
            </p>
            <ProgressBar value={value} className="mt-2" barClassName="bg-gradient-xp" />
            <p className="mt-1 text-right text-[11px] font-bold text-muted-foreground">{value}%</p>
        </Card>
    );
}
