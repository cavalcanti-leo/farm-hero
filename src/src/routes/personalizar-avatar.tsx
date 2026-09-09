import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PillButton, SectionTitle } from "@/components/ui-kit";
import { useApp, type AvatarLook } from "@/lib/app-state";
import {
    AvatarFigure,
    accessories,
    hairColors,
    hairStyles,
    outfitColors,
    skinTones,
} from "@/components/AvatarFigure";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/personalizar-avatar")({
    head: () => ({
        meta: [
            { title: "Personalizar Avatar — PharmaLife" },
            {
                name: "description",
                content:
                    "Monte o seu personagem: escolha gênero, tom de pele, cabelo, cor, roupa e acessórios no editor estilo game do PharmaLife.",
            },
            { property: "og:title", content: "Personalizar Avatar — PharmaLife" },
            {
                property: "og:description",
                content: "Editor de personagem do PharmaLife: cabelo, pele, roupa e acessórios.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
        ],
    }),
    component: PersonalizarAvatar,
});

const hairLabels: Record<AvatarLook["hairStyle"], string> = {
    curto: "Curto",
    medio: "Médio",
    longo: "Longo",
    cacheado: "Cacheado",
    coque: "Coque",
    careca: "Careca",
};

const accessoryLabels: Record<AvatarLook["accessory"], string> = {
    nenhum: "Nenhum",
    oculos: "Óculos",
    bone: "Boné",
    fone: "Fone",
};

function PersonalizarAvatar() {
    const { state, update } = useApp();
    const navigate = useNavigate();
    const look = state.look;
    const set = (patch: Partial<AvatarLook>) => update({ look: { ...look, ...patch } });

    return (
        <AppShell>
            <header className="sticky top-0 z-30 flex items-center gap-3 rounded-b-[2rem] border-b-3 border-ink bg-gradient-primary px-4 py-4 text-primary-foreground shadow-pop">
                <Link
                    to="/avatar"
                    aria-label="Voltar"
                    className="flex size-9 items-center justify-center rounded-full border-2 border-ink bg-card/30 text-lg font-extrabold active:scale-95"
                >
                    ←
                </Link>
                <h1 className="flex-1 text-center text-2xl font-extrabold drop-shadow-[2px_2px_0_var(--ink)]">
                    Criar personagem
                </h1>
                <span className="flex size-9 animate-wiggle items-center justify-center text-2xl">🎨</span>
            </header>

            <section className="px-4 py-4">
                <div className="sticker relative flex h-64 items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-sky">
                    <AvatarFigure look={look} className="h-56 animate-bob drop-shadow-xl" />
                </div>
            </section>

            <section className="space-y-4 px-4 pb-6">
                <div>
                    <SectionTitle>Gênero</SectionTitle>
                    <Card className="grid grid-cols-2 gap-2 p-3">
                        {(["masculino", "feminino"] as const).map((g) => (
                            <button
                                key={g}
                                onClick={() => set({ gender: g })}
                                className={cn(
                                    "rounded-2xl border-2 border-ink px-3 py-3 text-sm font-extrabold capitalize transition-transform active:scale-95",
                                    look.gender === g
                                        ? "bg-gradient-primary text-primary-foreground shadow-sticker"
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                {g === "masculino" ? "👦 Masculino" : "👧 Feminino"}
                            </button>
                        ))}
                    </Card>
                </div>

                <div>
                    <SectionTitle>Tom de pele</SectionTitle>
                    <Card className="flex flex-wrap gap-3 p-3">
                        {skinTones.map((c) => (
                            <Swatch key={c} color={c} active={look.skin === c} onClick={() => set({ skin: c })} />
                        ))}
                    </Card>
                </div>

                <div>
                    <SectionTitle>Cabelo</SectionTitle>
                    <Card className="space-y-3 p-3">
                        <div className="grid grid-cols-3 gap-2">
                            {hairStyles.map((h) => (
                                <button
                                    key={h}
                                    onClick={() => set({ hairStyle: h })}
                                    className={cn(
                                        "rounded-2xl border-2 border-ink px-2 py-2 text-xs font-extrabold transition-transform active:scale-95",
                                        look.hairStyle === h
                                            ? "bg-gradient-fun text-fun-foreground shadow-sticker"
                                            : "bg-muted text-muted-foreground",
                                    )}
                                >
                                    {hairLabels[h]}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {hairColors.map((c) => (
                                <Swatch
                                    key={c}
                                    color={c}
                                    active={look.hairColor === c}
                                    onClick={() => set({ hairColor: c })}
                                />
                            ))}
                        </div>
                    </Card>
                </div>

                <div>
                    <SectionTitle>Roupa</SectionTitle>
                    <Card className="flex flex-wrap gap-3 p-3">
                        {outfitColors.map((c) => (
                            <Swatch
                                key={c}
                                color={c}
                                active={look.outfitColor === c}
                                onClick={() => set({ outfitColor: c })}
                            />
                        ))}
                    </Card>
                </div>

                <div>
                    <SectionTitle>Acessórios</SectionTitle>
                    <Card className="grid grid-cols-4 gap-2 p-3">
                        {accessories.map((a) => (
                            <button
                                key={a}
                                onClick={() => set({ accessory: a })}
                                className={cn(
                                    "rounded-2xl border-2 border-ink px-2 py-2 text-xs font-extrabold transition-transform active:scale-95",
                                    look.accessory === a
                                        ? "bg-gradient-water text-primary-foreground shadow-sticker"
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                {accessoryLabels[a]}
                            </button>
                        ))}
                    </Card>
                </div>

                <PillButton variant="primary" onClick={() => navigate({ to: "/avatar" })}>
                    ✅ Salvar visual
                </PillButton>
                <PillButton
                    variant="soft"
                    onClick={() =>
                        set({
                            gender: "masculino",
                            skin: "#EDBA92",
                            hairStyle: "curto",
                            hairColor: "#2B2118",
                            outfitColor: "#8B5CF6",
                            accessory: "nenhum",
                        })
                    }
                >
                    🔄 Recomeçar
                </PillButton>
            </section>
        </AppShell>
    );
}

function Swatch({
    color,
    active,
    onClick,
}: {
    color: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            aria-label={`Cor ${color}`}
            onClick={onClick}
            style={{ backgroundColor: color }}
            className={cn(
                "size-10 rounded-full border-2 border-ink transition-transform active:scale-95",
                active && "scale-110 shadow-sticker ring-2 ring-primary ring-offset-2",
            )}
        />
    );
}
