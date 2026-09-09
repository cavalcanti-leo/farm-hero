import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useDailyMissions } from "@/hooks/use-daily-missions";
import {
  getRedeemedCoupons,
  saveRedeemedCoupon,
  type RedeemedCoupon,
} from "@/lib/database";
import {
  Award,
  Sparkles,
  CheckCircle2,
  Gift,
  Zap,
  Target,
  Coins,
  ShoppingBag,
  ArrowRight,
  Flame,
  Ticket,
  Copy,
  Check,
  Tag,
  Clock,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AvailableCoupon {
  id: string;
  codePrefix: string;
  title: string;
  category: string;
  discount: string;
  desc: string;
  costCoins: number;
  badge: string;
  color: string;
}

const COUPON_CATALOG: AvailableCoupon[] = [
  {
    id: "coup-amazon-30",
    codePrefix: "AMAZON30",
    title: "R$ 30 OFF na Amazon Brasil",
    category: "Amazon",
    discount: "R$ 30 OFF",
    desc: "Desconto no site e app Amazon para produtos de saúde, suplementos, dermocosméticos e bem-estar.",
    costCoins: 250,
    badge: "Parceiro Oficial 📦",
    color: "from-amber-500 to-yellow-600",
  },
  {
    id: "coup-ifood-25",
    codePrefix: "IFOOD25",
    title: "R$ 25 OFF no iFood",
    category: "iFood Delivery",
    discount: "R$ 25 OFF",
    desc: "Válido em restaurantes saudáveis, hortifrutis, mercados e farmácias credenciadas no iFood.",
    costCoins: 200,
    badge: "Mais Pedido 🍔",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "coup-99-15",
    codePrefix: "99APP15",
    title: "R$ 15 OFF em Corridas no 99",
    category: "99 Mobilidade",
    discount: "R$ 15 OFF",
    desc: "Desconto especial em corridas até sua farmácia de confiança, postos de saúde ou consultas médicas.",
    costCoins: 120,
    badge: "Transporte Fácil 🚗",
    color: "from-yellow-400 to-amber-500",
  },
  {
    id: "coup-meli-20",
    codePrefix: "MELI20",
    title: "Frete Grátis + R$ 20 OFF no Mercado Livre",
    category: "Mercado Livre",
    discount: "R$ 20 + Frete",
    desc: "Abatimento em aparelhos de pressão, termômetros, vitaminas e produtos de cuidados de saúde.",
    costCoins: 180,
    badge: "Envio Full ⚡",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "coup-paguemenos-25",
    codePrefix: "PAGUEMENOS25",
    title: "25% OFF na Farmácia Pague Menos",
    category: "Pague Menos",
    discount: "25% OFF",
    desc: "Desconto direto no balcão de todas as lojas e app da Pague Menos em medicamentos genéricos e contínuos.",
    costCoins: 160,
    badge: "Rede Nacional 💊",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "coup-drogasil-30",
    codePrefix: "DROGASIL30",
    title: "R$ 30 OFF na Drogasil",
    category: "Drogasil",
    discount: "R$ 30 OFF",
    desc: "Economize em compras acima de R$ 80 em vitaminas, protetor solar, hidratação e higiene pessoal.",
    costCoins: 220,
    badge: "Super Desconto 🩺",
    color: "from-rose-600 to-red-700",
  },
  {
    id: "coup-vale-comida-40",
    codePrefix: "VALECOMIDA40",
    title: "Vale-Alimentação R$ 40",
    category: "Vale-Comida / Nutrição",
    discount: "R$ 40 OFF",
    desc: "Desconto especial para aquisição de cestas de frutas, verduras frescas e alimentos saudáveis.",
    costCoins: 280,
    badge: "Nutrição Saudável 🥗",
    color: "from-emerald-500 to-teal-700",
  },
  {
    id: "coup-cons-free",
    codePrefix: "CLINICFREE",
    title: "Aferição & Consulta Grátis",
    category: "Atenção Farmacêutica",
    discount: "100% OFF",
    desc: "Aferição completa de glicemia e pressão arterial sem taxa na farmácia credenciada FarmaHero.",
    costCoins: 100,
    badge: "Saúde em Dia 🩺",
    color: "from-cyan-500 to-blue-600",
  },
];

export const RecompensasRoute: React.FC = () => {
  const { achievements, claimAchievement, streakDays, coins, level, xp, gainXpAndCoins } =
    useAppState();
  const { currentUser } = useAuth();
  const {
    isDark,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
    pageBgClass,
  } = useTheme();

  const {
    todaysMissions,
    claimedIds,
    claimReward,
    claimedCount,
    provenCount,
    totalCount,
    progressPct,
    appState,
  } = useDailyMissions();

  const [activeTab, setActiveTab] = useState<"cupons" | "missoes" | "conquistas">("cupons");
  const [redeemedList, setRedeemedList] = useState<RedeemedCoupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Carrega cupons do usuário
  useEffect(() => {
    if (currentUser?.id) {
      const list = getRedeemedCoupons(currentUser.id);
      setRedeemedList(list);
    }
  }, [currentUser?.id]);

  // Handler de troca de moedas por cupom
  const handleRedeemCoupon = (coupon: AvailableCoupon) => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para resgatar cupons.");
      return;
    }

    if (coins < coupon.costCoins) {
      toast.error(
        `Você precisa de ${coupon.costCoins} moedas. Saldo atual: ${coins} moedas.`,
      );
      return;
    }

    // Deduz moedas
    gainXpAndCoins(0, -coupon.costCoins, `Resgate de Cupom: ${coupon.title}`);

    // Cria código único
    const randomSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const code = `FARM-${coupon.codePrefix}-${randomSuffix}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const newRedeemed: RedeemedCoupon = {
      id: `rc_${Date.now()}`,
      userId: currentUser.id,
      code,
      title: coupon.title,
      discount: coupon.discount,
      costCoins: coupon.costCoins,
      redeemedAt: new Date().toISOString(),
      expiresAt,
      used: false,
    };

    saveRedeemedCoupon(newRedeemed);
    setRedeemedList((prev) => [newRedeemed, ...prev]);

    toast.success(`Cupom "${coupon.title}" resgatado! Código gerado: ${code} 🎉`);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Código copiado para a área de transferência! 📋");
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Title Header */}
      <div
        className={`rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cardBgClass} ${cardBorderClass}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-3 border-indigo-950 flex items-center justify-center text-white shrink-0 shadow-md">
            <Award className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className={`text-base font-black leading-tight ${textPrimaryClass}`}>
              Central de Recompensas & Cupons
            </h1>
            <p className={`text-xs font-bold ${textSecondaryClass}`}>
              Ganhe moedas realizando missões e troque por cupons reais de farmácia.
            </p>
          </div>
        </div>

        {/* Total coins badge */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 border-2 border-indigo-950 px-4 py-2 rounded-2xl flex items-center gap-2 text-indigo-950 font-black text-sm shadow-[2px_2px_0px_#1e1b4b] self-start sm:self-auto">
          <Coins className="w-5 h-5 text-indigo-950" />
          <span>{coins.toLocaleString("pt-BR")} Moedas 🪙</span>
        </div>
      </div>

      {/* Streak Showcase */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 border-4 border-indigo-950 rounded-3xl p-4 shadow-[4px_4px_0px_#1e1b4b] text-indigo-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white border-2 border-indigo-950 flex items-center justify-center text-orange-500 shrink-0 shadow-inner">
            <Flame className="w-6 h-6 fill-orange-500 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider">Sequência Ativa</h3>
            <p className="text-sm font-black">
              {streakDays} dias seguidos com a saúde e atendimentos em dia!
            </p>
          </div>
        </div>
        <Link href="/avatar">
          <div className="flex items-center gap-1 bg-indigo-950 text-white hover:bg-indigo-900 text-xs font-black px-3.5 py-2 rounded-2xl border-2 border-white shadow-sm transition-all">
            <ShoppingBag className="w-4 h-4" /> Customizar Avatar
          </div>
        </Link>
      </div>

      {/* Navegação de Abas */}
      <div className="flex rounded-2xl bg-slate-800/60 p-1 border border-slate-700 gap-1">
        {[
          { id: "cupons", label: "🎟️ Trocar por Cupons", badge: `${redeemedList.length} salvos` },
          { id: "missoes", label: "🎯 Missões Diárias", badge: `${claimedCount}/${totalCount}` },
          { id: "conquistas", label: "🏆 Conquistas", badge: `${achievements.filter((a) => a.completed).length}` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          ABA 1: TROCA DE MOEDAS POR CUPONS (Farmacêutico e Paciente)
      ════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "cupons" && (
        <div className="space-y-4">
          {/* Meus Cupons Resgatados */}
          {redeemedList.length > 0 && (
            <div className={`rounded-3xl p-4 space-y-3 ${cardBgClass} ${cardBorderClass}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
                  <h3 className={`text-sm font-black uppercase tracking-wider ${textPrimaryClass}`}>
                    Meus Cupons Resgatados ({redeemedList.length})
                  </h3>
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  Prontos para Uso ✅
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {redeemedList.map((cup) => (
                  <div
                    key={cup.id}
                    className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/40 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                          {cup.discount}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expira em 30 dias
                        </span>
                      </div>
                      <h4 className={`text-xs font-black mt-1.5 leading-snug ${textPrimaryClass}`}>
                        {cup.title}
                      </h4>
                    </div>

                    {/* Código e Botão Copiar */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-500/20">
                      <code className="text-xs font-black text-emerald-300 font-mono tracking-wider bg-slate-900/80 px-2 py-1 rounded-lg border border-emerald-500/30">
                        {cup.code}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(cup.code)}
                        className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 active:scale-95 transition-all"
                      >
                        {copiedCode === cup.code ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 stroke-[2.5]" /> Copiar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Catálogo de Cupons Disponíveis */}
          <div className={`rounded-3xl p-4 space-y-3 ${cardBgClass} ${cardBorderClass}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600 stroke-[3]" />
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-wider ${textPrimaryClass}`}>
                    Catálogo de Cupons FarmHero
                  </h3>
                  <p className={`text-[11px] font-bold ${textSecondaryClass}`}>
                    Troque suas moedas por descontos em farmácias, consultas e suplementos.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {COUPON_CATALOG.map((item) => {
                const canAfford = coins >= item.costCoins;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-4 border-2 flex flex-col justify-between gap-3 transition-all ${
                      canAfford
                        ? "border-slate-700 hover:border-purple-500/60 bg-slate-800/60"
                        : "border-slate-800 bg-slate-900/40 opacity-80"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {item.badge}
                        </span>
                        <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          {item.costCoins} Moedas
                        </span>
                      </div>

                      <h4 className={`text-sm font-black leading-tight ${textPrimaryClass}`}>
                        {item.title}
                      </h4>
                      <p className={`text-xs font-medium leading-relaxed ${textSecondaryClass}`}>
                        {item.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleRedeemCoupon(item)}
                      className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                        canAfford
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-950 border-2 border-indigo-950 shadow-[2px_2px_0px_#1e1b4b] active:scale-95"
                          : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      }`}
                    >
                      <Ticket className="w-4 h-4" />
                      {canAfford
                        ? `Trocar por ${item.costCoins} Moedas 🪙`
                        : `Faltam ${item.costCoins - coins} Moedas`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          ABA 2: MISSÕES DIÁRIAS (Adaptadas por Papel)
      ════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "missoes" && (
        <div className={`rounded-3xl p-4 space-y-3 ${cardBgClass} ${cardBorderClass}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600 stroke-[3]" />
              <h3 className={`text-sm font-black uppercase tracking-wider ${textPrimaryClass}`}>
                Missões Diárias de Moedas
              </h3>
            </div>
            <span className="text-[11px] font-black text-purple-700 bg-purple-100 border border-purple-300 px-2.5 py-0.5 rounded-full">
              {claimedCount} / {totalCount} resgatadas
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 border border-indigo-950/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-600 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="space-y-2.5 pt-1">
            {todaysMissions.map((mission) => {
              const isClaimed = claimedIds.has(mission.id);
              const proof = mission.checkProof(appState);

              return (
                <div
                  key={mission.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all ${
                    isClaimed
                      ? "bg-emerald-50 border-emerald-400 opacity-75"
                      : proof.isSatisfied
                        ? "bg-amber-50 border-amber-400"
                        : isDark
                          ? "bg-slate-800 border-slate-700"
                          : "bg-slate-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <span className="text-2xl shrink-0">{mission.emoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-xs font-black ${
                            isClaimed ? "line-through text-emerald-800" : textPrimaryClass
                          }`}
                        >
                          {mission.title}
                        </h4>
                        {proof.isSatisfied && !isClaimed && (
                          <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            ✓ Comprovante Registrado!
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] font-bold mt-0.5 ${textSecondaryClass}`}>
                        {mission.desc}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                          +{mission.coins} Moedas 🪙 | +{mission.xp} XP
                        </span>
                        <span className={`text-[10px] font-extrabold ${textSecondaryClass}`}>
                          Progresso: {proof.currentText} / {proof.targetText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isClaimed ? (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resgatada
                      </span>
                    ) : proof.isSatisfied ? (
                      <Button
                        onClick={() => claimReward(mission)}
                        size="sm"
                        variant="emerald"
                        className="text-xs font-black border-2 border-indigo-950 animate-bounce shadow-sm"
                      >
                        Resgatar {mission.coins} 🪙
                      </Button>
                    ) : (
                      <Link
                        href={mission.actionUrl}
                        className="flex items-center gap-1 text-[11px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-xl border-2 border-indigo-950 shadow-sm active:scale-95 transition-all"
                      >
                        {mission.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          ABA 3: CONQUISTAS DA JORNADA
      ════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "conquistas" && (
        <div className={`rounded-3xl p-4 space-y-3 ${cardBgClass} ${cardBorderClass}`}>
          <h3
            className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${textPrimaryClass}`}
          >
            <Gift className="w-4 h-4 text-purple-600 stroke-[3]" /> Conquistas da Jornada
          </h3>

          <div className="space-y-2.5">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border-2 space-y-2 ${
                  ach.completed
                    ? "bg-emerald-50 border-emerald-400"
                    : isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-slate-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs font-black ${textPrimaryClass}`}>{ach.title}</h4>
                  <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-400">
                    +{ach.rewardCoins} 🪙 | +{ach.rewardXp} XP
                  </span>
                </div>
                <p className={`text-[11px] font-bold ${textSecondaryClass}`}>{ach.description}</p>

                <div className="pt-1 flex items-center justify-between gap-2">
                  <div className="h-2.5 flex-1 bg-slate-200 dark:bg-slate-700 border border-indigo-950/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      style={{ width: `${ach.progress}%` }}
                    />
                  </div>
                  {ach.completed ? (
                    <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> Conquistada!
                    </span>
                  ) : ach.progress >= 100 ? (
                    <Button
                      onClick={() => claimAchievement(ach.id)}
                      size="sm"
                      variant="amber"
                      className="text-[10px] font-black border-2 border-indigo-950"
                    >
                      Resgatar Recompensa 🪙
                    </Button>
                  ) : (
                    <span className={`text-[10px] font-bold ${textSecondaryClass}`}>
                      {ach.progress}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
