import { createFileRoute, Link } from "@tanstack/react-router";
import {
    User,
    Medal,
    History,
    Store,
    Settings,
    HelpCircle,
    Share2,
    ShieldCheck,
    LogOut,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Disclaimer, ProgressBar } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";
import avatarHero from "@/assets/avatar-hero.png";

export const Route = createFileRoute("/mais")({
    head: () => ({
        meta: [
            { title: "Minha Conta — PharmaLife" },
            {
                name: "description",
                content:
                    "Conta, conquistas, histórico de pontos, farmácia vinculada, privacidade LGPD e ajuda.",
            },
            { property: "og:title", content: "Minha Conta — PharmaLife" },
            {
                property: "og:description",
                content: "Gerencie seu perfil, sua farmácia vinculada e seus dados pessoais.",
            },
        ],
    }),
    component: Mais,
});

const items = [
    { icon: User, label: "Minha conta" },
    { icon: Medal, label: "Minhas conquistas", badge: "12" },
    { icon: History, label: "Histórico de pontos" },
    { icon: Store, label: "Farmácia vinculada" },
    { icon: Share2, label: "Compartilhar evolução" },
    { icon: ShieldCheck, label: "Privacidade e LGPD" },
    { icon: Settings, label: "Configurações" },
    { icon: HelpCircle, label: "Ajuda" },
];

function Mais() {
    const { state } = useApp();

    return (
        <AppShell>
            <section className="rounded-b-[2rem] bg-gradient-primary px-4 pb-6 pt-6 text-primary-foreground shadow-soft">
                <div className="flex items-center gap-3">
                    <img
                        src={avatarHero}
                        alt={`Avatar de ${state.name}`}
                        width={768}
                        height={1024}
                        loading="lazy"
                        className="h-20 w-auto"
                    />
                    <div className="flex-1">
                        <p className="text-lg font-bold">{state.name}</p>
                        <p className="text-xs opacity-90">
                            Nível {state.level} · {state.pharmacy}
                        </p>
                        <ProgressBar
                            value={(state.xp / state.xpToNext) * 100}
                            className="mt-2 bg-primary-foreground/25"
                            barClassName="bg-gradient-xp"
                        />
                        <p className="mt-1 text-[11px] opacity-90">
                            {state.xp.toLocaleString("pt-BR")} / {state.xpToNext.toLocaleString("pt-BR")} XP
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-2 px-4 py-5">
                <Link to="/recompensas">
                    <Card className="flex items-center gap-3 bg-gradient-food text-primary-foreground">
                        <span className="text-2xl">🎁</span>
                        <p className="flex-1 text-sm font-bold">
                            {state.points.toLocaleString("pt-BR")} pontos · ver recompensas
                        </p>
                        <span>›</span>
                    </Card>
                </Link>

                {items.map(({ icon: Icon, label, badge }) => (
                    <Card key={label} className="flex items-center gap-3 p-3.5">
                        <Icon className="size-5 text-primary" />
                        <span className="flex-1 text-sm font-semibold">{label}</span>
                        {badge && (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                                {badge}
                            </span>
                        )}
                        <span className="text-muted-foreground">›</span>
                    </Card>
                ))}

                <Card className="flex items-center gap-3 p-3.5 text-destructive">
                    <LogOut className="size-5" />
                    <span className="flex-1 text-sm font-semibold">Sair</span>
                </Card>

                <Disclaimer />
            </section>
        </AppShell>
    );
}
