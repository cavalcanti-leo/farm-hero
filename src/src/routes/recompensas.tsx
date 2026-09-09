import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PillButton, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/recompensas")({
    head: () => ({
        meta: [
            { title: "Recompensas — PharmaLife" },
            {
                name: "description",
                content: "Troque pontos por cupons, descontos e cashback com parceiros da sua farmácia.",
            },
            { property: "og:title", content: "Recompensas — PharmaLife" },
            {
                property: "og:description",
                content: "Ranking bimestral e prêmios: cupons, cashback, academia, iFood e mais.",
            },
        ],
    }),
    component: Recompensas,
});

const partners = [
    { emoji: "🛍️", name: "Shopee", cost: 500 },
    { emoji: "🍔", name: "iFood", cost: 500 },
    { emoji: "🏋️", name: "Academia", cost: 700 },
    { emoji: "💊", name: "Desconto Farmácia", cost: 300 },
    { emoji: "🎬", name: "Cinema", cost: 600 },
    { emoji: "💰", name: "Cashback", cost: 900 },
];

function Recompensas() {
    const { state, update } = useApp();

    const redeem = (cost: number) => {
        if (state.points >= cost) update({ points: state.points - cost });
    };

    return (
        <AppShell>
            <header className="sticky top-0 z-30 rounded-b-3xl bg-gradient-food px-4 py-5 text-primary-foreground shadow-soft">
                <h1 className="text-center text-xl font-bold">Recompensas 🎁</h1>
            </header>

            <section className="space-y-4 px-4 py-5">
                <Card className="text-center">
                    <p className="text-3xl font-bold text-primary">
                        {state.points.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-xs text-muted-foreground">pontos disponíveis</p>
                    <p className="mt-1 text-xs font-bold text-primary underline">Como ganhar pontos?</p>
                </Card>

                <Card className="bg-gradient-primary text-primary-foreground">
                    <p className="text-xs opacity-90">Ranking bimestral</p>
                    <p className="text-lg font-bold">Você está em 2º lugar! 🏆</p>
                    <PillButton variant="soft" className="mt-3">
                        Ver ranking
                    </PillButton>
                </Card>

                <div>
                    <SectionTitle>Troque seus pontos</SectionTitle>
                    <div className="grid grid-cols-3 gap-2">
                        {partners.map((p) => (
                            <button key={p.name} onClick={() => redeem(p.cost)}>
                                <Card className="h-full p-3 text-center active:scale-95">
                                    <span className="text-2xl">{p.emoji}</span>
                                    <p className="mt-1 text-[10px] font-bold leading-tight">{p.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{p.cost} pts</p>
                                </Card>
                            </button>
                        ))}
                    </div>
                </div>

                <Card className="bg-secondary">
                    <p className="text-sm font-bold">♻️ Descarte consciente</p>
                    <p className="mt-1 text-xs text-secondary-foreground">
                        Leve medicamentos vencidos à {state.pharmacy}, escaneie o QR Code do farmacêutico e
                        receba pontos extras.
                    </p>
                </Card>

                <PillButton>🎁 Resgatar recompensas</PillButton>
            </section>
        </AppShell>
    );
}
