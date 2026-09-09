import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Target, Trophy, Store } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, ProgressBar } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";
import avatarHero from "@/assets/avatar-hero.png";
import backyardBg from "@/assets/backyard-bg.jpg";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "PharmaLife — Cuide do seu avatar, cuide de você" },
            {
                name: "description",
                content:
                    "App gamificado de adesão ao tratamento: medicamentos, água, alimentação, humor e recompensas com sua farmácia.",
            },
            { property: "og:title", content: "PharmaLife — Cuide do seu avatar, cuide de você" },
            {
                property: "og:description",
                content: "App gamificado de adesão ao tratamento: medicamentos, água, alimentação, humor e recompensas com sua farmácia.",
            },
        ],
    }),
    component: Index,
});

function Index() {
    const { state } = useApp();
    const xpPct = (state.xp / state.xpToNext) * 100;

    return (
        <AppShell>
            <section
                className="relative overflow-hidden rounded-b-[2.5rem] border-b-3 border-ink bg-cover bg-bottom bg-no-repeat pb-6"
                style={{ backgroundImage: `url(${backyardBg})` }}
            >
                <div className="pointer-events-none absolute inset-0 bg-background/10" />
                <div className="relative flex items-start justify-between px-4 pt-5">
                    <span className="sticker -rotate-2 rounded-full bg-gradient-primary px-4 py-2 text-xl font-extrabold uppercase tracking-tight text-primary-foreground">
                        PharmaLife
                    </span>
                    <button
                        aria-label="Notificações"
                        className="sticker relative flex size-11 items-center justify-center rounded-full bg-card text-primary"
                    >
                        <Bell className="size-5" strokeWidth={2.8} />
                        <span className="absolute -right-1.5 -top-1.5 flex size-6 animate-pop items-center justify-center rounded-full border-2 border-ink bg-destructive text-[11px] font-extrabold text-destructive-foreground">
                            3
                        </span>
                    </button>
                </div>

                <div className="relative mt-2 flex items-end justify-between px-4">
                    <img
                        src={avatarHero}
                        alt={`Avatar de ${state.name}`}
                        width={768}
                        height={1024}
                        className="h-56 w-auto animate-bob drop-shadow-xl"
                    />
                    <div className="mb-8 flex flex-col items-end gap-3">
                        <div className="sticker max-w-[10.5rem] rotate-1 rounded-3xl rounded-br-md bg-card p-3 text-sm font-extrabold">
                            E aí, {state.name.split(" ")[0]}! Bora upar de nível hoje? 🚀
                        </div>
                        <HomeAction to="/saude" icon={<Target className="size-4" />} label="Missões" />
                        <HomeAction to="/recompensas" icon={<Trophy className="size-4" />} label="Ranking" />
                        <HomeAction to="/recompensas" icon={<Store className="size-4" />} label="Loja" />
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-[1.6fr_1fr] gap-3 px-4">
                    <Card className="-rotate-1 p-3">
                        <p className="text-sm font-extrabold uppercase tracking-wide">Nível {state.level} 🏅</p>
                        <ProgressBar value={xpPct} className="mt-1.5" barClassName="bg-gradient-xp" />
                        <p className="mt-1 text-[11px] font-bold text-muted-foreground">
                            {state.xp.toLocaleString("pt-BR")} / {state.xpToNext.toLocaleString("pt-BR")} XP
                        </p>
                    </Card>
                    <Card className="flex rotate-1 flex-col items-center justify-center bg-gradient-fun p-3">
                        <p className="text-xl font-extrabold text-fun-foreground">
                            {state.points.toLocaleString("pt-BR")}
                        </p>
                        <p className="text-[11px] font-extrabold uppercase text-fun-foreground">pontos</p>
                    </Card>
                </div>
            </section>

            <section className="space-y-4 px-4 py-5">
                <Card className="bg-gradient-primary text-primary-foreground">
                    <div className="flex items-center gap-3">
                        <span className="animate-wiggle text-4xl">⭐</span>
                        <div className="flex-1">
                            <p className="text-base font-extrabold uppercase">Missão diária</p>
                            <p className="text-xs font-bold opacity-90">4 / 6 concluídas — quase lá!</p>
                            <ProgressBar
                                value={66}
                                className="mt-2 bg-primary-foreground/25"
                                barClassName="bg-gradient-xp"
                            />
                        </div>
                        <span className="animate-pop text-4xl">🎁</span>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                    <SummaryTile
                        to="/saude/medicamentos"
                        emoji="💊"
                        title="Medicamentos"
                        value={`${state.meds.filter((m) => m.taken).length} / ${state.meds.length} tomados`}
                        tint="bg-gradient-med"
                    />
                    <SummaryTile
                        to="/saude/agua"
                        emoji="💧"
                        title="Água"
                        value={`${state.waterCups} / ${state.waterGoal} copos`}
                        tint="bg-gradient-water"
                    />
                    <SummaryTile
                        to="/saude/atividade"
                        emoji="👟"
                        title="Atividade"
                        value={`${state.activities.reduce((a, b) => a + b.minutes, 0)} / 60 min`}
                        tint="bg-gradient-move"
                    />
                    <SummaryTile
                        to="/saude/alimentacao"
                        emoji="🥗"
                        title="Alimentação"
                        value="Mandou bem!"
                        tint="bg-gradient-food"
                    />
                </div>

                <Card className="flex rotate-1 items-center gap-3 bg-gradient-fun text-fun-foreground">
                    <span className="animate-pop text-4xl">🏅</span>
                    <p className="flex-1 text-sm font-extrabold">
                        +50 pontos hoje! Sequência de {state.streak} dias em chamas 🔥
                    </p>
                </Card>
            </section>
        </AppShell>
    );
}

function HomeAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            to={to}
            className="sticker flex w-36 items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-extrabold uppercase text-primary transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
            {icon}
            {label}
        </Link>
    );
}

function SummaryTile({
    to,
    emoji,
    title,
    value,
    tint,
}: {
    to: string;
    emoji: string;
    title: string;
    value: string;
    tint: string;
}) {
    return (
        <Link to={to} className="block">
            <Card className="h-full text-center transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none">
                <div
                    className={`mx-auto flex size-14 items-center justify-center rounded-2xl border-2 border-ink text-3xl ${tint}`}
                >
                    {emoji}
                </div>
                <p className="mt-2 text-sm font-extrabold">{title}</p>
                <p className="text-xs font-bold text-muted-foreground">{value}</p>
            </Card>
        </Link>
    );
}

