import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gamepad2,
  Sparkles,
  Trophy,
  RotateCcw,
  Zap,
  Play,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Heart,
  Timer,
  Eye,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// 1. DADOS DO QUIZ DA SAÚDE
// ─────────────────────────────────────────────────────────────────────────────
interface QuizItem {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizItem[] = [
  {
    question: "Qual é a quantidade recomendada diária aproximada de água para um adulto?",
    options: ["500 ml", "1,5 a 2,5 litros", "5 litros", "10 litros"],
    correct: 1,
    explanation: "Em média, 35ml por kg de peso corporal, girando em torno de 2 litros diários.",
  },
  {
    question: "Qual hábito ajuda a melhorar a qualidade do sono profundo?",
    options: [
      "Usar celular na cama com brilho alto",
      "Tomar café expresso às 22h",
      "Manter o quarto escuro e sem telas antes de dormir",
      "Comer refeições pesadas minutos antes de deitar",
    ],
    correct: 2,
    explanation: "A luz azul das telas inibe a melatonina, hormônio essencial do descanso.",
  },
  {
    question: "Qual grupo de alimentos é essencial para a manutenção dos músculos e tecidos?",
    options: ["Proteínas", "Açúcares refinados", "Gorduras trans", "Refrigerantes"],
    correct: 0,
    explanation: "As proteínas fornecem aminoácidos vitais para reconstrução celular e muscular.",
  },
  {
    question: "O que fazer caso esqueça de tomar uma dose de medicamento contínuo?",
    options: [
      "Tomar dose dupla no dia seguinte",
      "Parar o tratamento definitivamente",
      "Consultar a bula ou orientar-se com seu farmacêutico",
      "Tomar 3 comprimidos de uma vez",
    ],
    correct: 2,
    explanation: "Nunca tome doses dobradas. Consulte sempre o farmacêutico para reposicionar horários.",
  },
  {
    question: "Qual é a faixa de pressão arterial considerada normal para um adulto em repouso?",
    options: ["180/110 mmHg", "120/80 mmHg", "60/40 mmHg", "200/100 mmHg"],
    correct: 1,
    explanation: "Valores em torno de 120 por 80 mmHg são considerados ótimos pela Sociedade de Cardiologia.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. DADOS DO JOGO DA MEMÓRIA
// ─────────────────────────────────────────────────────────────────────────────
interface MemoryCard {
  id: number;
  pairKey: string;
  label: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_PAIRS = [
  { pairKey: "agua", label: "Água Pura", icon: "💧" },
  { pairKey: "maca", label: "Fruta Fresca", icon: "🍎" },
  { pairKey: "remedio", label: "Remédio no Horário", icon: "💊" },
  { pairKey: "corrida", label: "Exercício Físico", icon: "🏃" },
  { pairKey: "sono", label: "Sono Reparador", icon: "😴" },
  { pairKey: "medita", label: "Paz Mental", icon: "🧘" },
];

function createShuffledDeck(): MemoryCard[] {
  const deck: MemoryCard[] = [];
  let id = 1;
  MEMORY_PAIRS.forEach((item) => {
    // Adiciona 2 cartas para cada item
    deck.push({ id: id++, pairKey: item.pairKey, label: item.label, icon: item.icon, isFlipped: false, isMatched: false });
    deck.push({ id: id++, pairKey: item.pairKey, label: item.label, icon: item.icon, isFlipped: false, isMatched: false });
  });
  // Embaralha
  return deck.sort(() => Math.random() - 0.5);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DADOS DO REFLEXO RÁPIDO (SPEED TAP)
// ─────────────────────────────────────────────────────────────────────────────
interface TargetTile {
  id: number;
  type: "healthy" | "unhealthy" | "empty";
  icon: string;
  label: string;
}

const HEALTHY_TARGETS = [
  { icon: "💧", label: "Água" },
  { icon: "🥦", label: "Brócolis" },
  { icon: "🍎", label: "Maçã" },
  { icon: "💊", label: "Vitamina" },
  { icon: "🥑", label: "Abacate" },
  { icon: "🩺", label: "Exame" },
];

const UNHEALTHY_TARGETS = [
  { icon: "🍟", label: "Fritura" },
  { icon: "🥤", label: "Refrigerante" },
  { icon: "🍩", label: "Açúcar" },
  { icon: "🚬", label: "Cigarro" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. DADOS DA ROLETA DA SAÚDE
// ─────────────────────────────────────────────────────────────────────────────
interface WheelSegment {
  label: string;
  coins: number;
  xp: number;
  color: string;
  badge: string;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { label: "+35 Moedas", coins: 35, xp: 50, color: "#10b981", badge: "🪙 Moedas" },
  { label: "+120 XP", coins: 15, xp: 120, color: "#8b5cf6", badge: "⚡ Super XP" },
  { label: "+50 Moedas", coins: 50, xp: 70, color: "#f59e0b", badge: "🪙 Moedas" },
  { label: "+80 Moedas", coins: 80, xp: 100, color: "#06b6d4", badge: "👑 JackPot" },
  { label: "+200 XP", coins: 25, xp: 200, color: "#ec4899", badge: "🔥 Turbo XP" },
  { label: "+100 Moedas", coins: 100, xp: 150, color: "#e11d48", badge: "💎 Diamante" },
];

export const JogosRoute: React.FC = () => {
  const { gainXpAndCoins, coins } = useAppState();
  const {
    isDark,
    cardBgClass,
    cardBorderClass,
    textPrimaryClass,
    textSecondaryClass,
    pageBgClass,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<"quiz" | "memoria" | "reflexo" | "roleta">("memoria");

  // ═════════════════════════════════════════════════════════════════════════
  // ESTADOS DO QUIZ
  // ═════════════════════════════════════════════════════════════════════════
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return; // evita clique duplo
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === QUIZ_QUESTIONS[quizIdx].correct;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      toast.success("Correto! +20 Moedas 🪙");
    } else {
      toast.error("Resposta incorreta. Leia a dica!");
    }

    setTimeout(() => {
      if (quizIdx + 1 < QUIZ_QUESTIONS.length) {
        setQuizIdx((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
        const totalCoins = (quizScore + (isCorrect ? 1 : 0)) * 25;
        const totalXp = (quizScore + (isCorrect ? 1 : 0)) * 50;
        gainXpAndCoins(totalXp, totalCoins, "Completou o Quiz FarmaHero!");
      }
    }, 1200);
  };

  const restartQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // ESTADOS DO JOGO DA MEMÓRIA
  // ═════════════════════════════════════════════════════════════════════════
  const [deck, setDeck] = useState<MemoryCard[]>(() => createShuffledDeck());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryComplete, setMemoryComplete] = useState(false);
  const [isProcessingMatch, setIsProcessingMatch] = useState(false);

  const handleFlipCard = (id: number) => {
    if (isProcessingMatch) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    // Vira a carta selecionada
    const newDeck = deck.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setDeck(newDeck);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      setIsProcessingMatch(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = newDeck.find((c) => c.id === firstId)!;
      const secondCard = newDeck.find((c) => c.id === secondId)!;

      if (firstCard.pairKey === secondCard.pairKey) {
        // Encontrou o par!
        setTimeout(() => {
          setDeck((current) =>
            current.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c,
            ),
          );
          setFlippedCards([]);
          setIsProcessingMatch(false);
          toast.success(`Par de ${firstCard.label} encontrado! ✨`);

          // Checa se completou o jogo
          const remaining = newDeck.filter((c) => !c.isMatched && c.id !== firstId && c.id !== secondId);
          if (remaining.length === 0) {
            setMemoryComplete(true);
            gainXpAndCoins(150, 75, "Vitória no Jogo da Memória dos Hábitos!");
          }
        }, 500);
      } else {
        // Não é par: desvira após 1s
        setTimeout(() => {
          setDeck((current) =>
            current.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c,
            ),
          );
          setFlippedCards([]);
          setIsProcessingMatch(false);
        }, 1000);
      }
    }
  };

  const restartMemory = () => {
    setDeck(createShuffledDeck());
    setFlippedCards([]);
    setMemoryMoves(0);
    setMemoryComplete(false);
    setIsProcessingMatch(false);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // ESTADOS DO REFLEXO RÁPIDO (SPEED TAP)
  // ═════════════════════════════════════════════════════════════════════════
  const [reflexActive, setReflexActive] = useState(false);
  const [reflexTimeLeft, setReflexTimeLeft] = useState(30);
  const [reflexScore, setReflexScore] = useState(0);
  const [reflexTiles, setReflexTiles] = useState<TargetTile[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i, type: "empty", icon: "", label: "" })),
  );
  const [reflexFinished, setReflexFinished] = useState(false);

  // Timer do Reflexo Rápido
  useEffect(() => {
    if (!reflexActive) return;

    if (reflexTimeLeft <= 0) {
      setReflexActive(false);
      setReflexFinished(true);
      const earnedCoins = Math.max(20, Math.floor(reflexScore * 3));
      const earnedXp = Math.max(40, Math.floor(reflexScore * 6));
      gainXpAndCoins(earnedXp, earnedCoins, "Reflexo Rápido FarmHero Concluído!");
      return;
    }

    const timer = setInterval(() => {
      setReflexTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [reflexActive, reflexTimeLeft, reflexScore, gainXpAndCoins]);

  // Spawner de alvos na grade 3x3
  useEffect(() => {
    if (!reflexActive) return;

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * 9);
      const isHealthy = Math.random() > 0.35; // 65% de chance de ser saudável

      setReflexTiles((prev) => {
        return prev.map((tile, i) => {
          if (i === randomIdx) {
            if (isHealthy) {
              const item = HEALTHY_TARGETS[Math.floor(Math.random() * HEALTHY_TARGETS.length)];
              return { id: i, type: "healthy", icon: item.icon, label: item.label };
            } else {
              const item = UNHEALTHY_TARGETS[Math.floor(Math.random() * UNHEALTHY_TARGETS.length)];
              return { id: i, type: "unhealthy", icon: item.icon, label: item.label };
            }
          }
          // Some de tempos em tempos
          return Math.random() > 0.4 ? { id: i, type: "empty", icon: "", label: "" } : tile;
        });
      });
    }, 850);

    return () => clearInterval(interval);
  }, [reflexActive]);

  const handleTileClick = (index: number) => {
    if (!reflexActive) return;
    const tile = reflexTiles[index];

    if (tile.type === "healthy") {
      setReflexScore((s) => s + 10);
      setReflexTiles((prev) =>
        prev.map((t, i) => (i === index ? { id: i, type: "empty", icon: "", label: "" } : t)),
      );
      toast.success(`+10 pts! ${tile.label} saudável 🎯`, { duration: 800 });
    } else if (tile.type === "unhealthy") {
      setReflexScore((s) => Math.max(0, s - 5));
      setReflexTiles((prev) =>
        prev.map((t, i) => (i === index ? { id: i, type: "empty", icon: "", label: "" } : t)),
      );
      toast.error(`-5 pts! Evite ${tile.label}! ⚠️`, { duration: 800 });
    }
  };

  const startReflexGame = () => {
    setReflexScore(0);
    setReflexTimeLeft(30);
    setReflexFinished(false);
    setReflexTiles(Array.from({ length: 9 }, (_, i) => ({ id: i, type: "empty", icon: "", label: "" })));
    setReflexActive(true);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // ESTADOS DA ROLETA DA SAÚDE
  // ═════════════════════════════════════════════════════════════════════════
  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<WheelSegment | null>(null);
  const [spinDeg, setSpinDeg] = useState(0);
  const [canSpinToday, setCanSpinToday] = useState(true);

  useEffect(() => {
    try {
      const lastSpin = localStorage.getItem("farmhero_last_wheel_spin");
      if (lastSpin) {
        const lastDate = new Date(lastSpin).toDateString();
        const today = new Date().toDateString();
        setCanSpinToday(lastDate !== today);
      }
    } catch {}
  }, []);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setWheelResult(null);

    // Sorteia um dos 6 segmentos
    const chosenIdx = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const chosenSegment = WHEEL_SEGMENTS[chosenIdx];

    // Cálculo dos graus (6 fatias = 60 graus cada)
    const extraRotations = 5 * 360; // 5 voltas completas
    const targetAngle = extraRotations + (360 - chosenIdx * 60) - 30;

    setSpinDeg((prev) => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setWheelResult(chosenSegment);
      gainXpAndCoins(chosenSegment.xp, chosenSegment.coins, `Giro da Roleta da Saúde: ${chosenSegment.label}!`);
      try {
        localStorage.setItem("farmhero_last_wheel_spin", new Date().toISOString());
        setCanSpinToday(false);
      } catch {}
    }, 3800);
  };

  return (
    <div className={`space-y-6 font-sans animate-in fade-in duration-300 p-2 sm:p-4 ${pageBgClass}`}>
      {/* Header Principal do Arcade */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${cardBgClass} ${cardBorderClass}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Gamepad2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-black ${textPrimaryClass}`}>
                Arcade & Mini-Jogos FarmHero
              </h1>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Recompensas 🪙
              </span>
            </div>
            <p className={`text-xs font-semibold mt-1 ${textSecondaryClass}`}>
              Jogue diariamente para treinar seu conhecimento, reflexo e memória, acumulando muitas moedas e XP!
            </p>
          </div>
        </div>

        {/* Saldo de Moedas do Jogador */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <span className="text-xl">🪙</span>
          <div>
            <div className="text-[10px] font-bold text-amber-300 uppercase leading-none">Suas Moedas</div>
            <div className="text-base font-black leading-tight text-amber-400">{coins}</div>
          </div>
        </div>
      </div>

      {/* Navegação de Abas entre os 4 Jogos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab("memoria")}
          className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 justify-center text-xs font-black ${
            activeTab === "memoria"
              ? "bg-purple-600 border-purple-500 text-white shadow-md scale-[1.02]"
              : `${cardBgClass} ${cardBorderClass} ${textPrimaryClass} opacity-80 hover:opacity-100`
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Memória Saudável</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reflexo")}
          className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 justify-center text-xs font-black ${
            activeTab === "reflexo"
              ? "bg-emerald-600 border-emerald-500 text-white shadow-md scale-[1.02]"
              : `${cardBgClass} ${cardBorderClass} ${textPrimaryClass} opacity-80 hover:opacity-100`
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Reflexo Rápido</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("roleta")}
          className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 justify-center text-xs font-black ${
            activeTab === "roleta"
              ? "bg-rose-600 border-rose-500 text-white shadow-md scale-[1.02]"
              : `${cardBgClass} ${cardBorderClass} ${textPrimaryClass} opacity-80 hover:opacity-100`
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Roleta Diária</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("quiz")}
          className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 justify-center text-xs font-black ${
            activeTab === "quiz"
              ? "bg-cyan-600 border-cyan-500 text-white shadow-md scale-[1.02]"
              : `${cardBgClass} ${cardBorderClass} ${textPrimaryClass} opacity-80 hover:opacity-100`
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Quiz da Saúde</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          JOGO 1: MEMÓRIA SAUDÁVEL
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "memoria" && (
        <div className={`rounded-3xl p-5 sm:p-7 border shadow-lg space-y-6 ${cardBgClass} ${cardBorderClass}`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className={`text-lg font-black flex items-center gap-2 ${textPrimaryClass}`}>
                <Eye className="w-5 h-5 text-purple-400" /> Jogo da Memória dos Hábitos Saudáveis
              </h2>
              <p className={`text-xs font-semibold mt-0.5 ${textSecondaryClass}`}>
                Encontre todos os pares de hábitos saudáveis com o menor número de tentativas!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-black">
                Movimentos: {memoryMoves}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={restartMemory}
                className="gap-1.5 text-xs font-black rounded-xl border-purple-500/40 text-purple-300 hover:bg-purple-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
              </Button>
            </div>
          </div>

          {!memoryComplete ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {deck.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleFlipCard(card.id)}
                  disabled={card.isFlipped || card.isMatched || isProcessingMatch}
                  className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all duration-300 select-none ${
                    card.isFlipped || card.isMatched
                      ? "bg-purple-600/30 border-purple-400 shadow-md scale-[0.98]"
                      : "bg-slate-800/80 border-slate-700 hover:border-purple-400 hover:scale-105 active:scale-95"
                  }`}
                >
                  {card.isFlipped || card.isMatched ? (
                    <div className="flex flex-col items-center gap-1 animate-in zoom-in duration-200">
                      <span className="text-3xl sm:text-4xl">{card.icon}</span>
                      <span className="text-[10px] sm:text-[11px] font-black text-white leading-tight truncate max-w-[80px]">
                        {card.label}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 opacity-70">
                      <span className="text-2xl sm:text-3xl">❓</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">FarmHero</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-purple-950/40 border-2 border-purple-500/50 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center text-3xl animate-bounce">
                🏆
              </div>
              <h3 className="text-2xl font-black text-white">Memória de Campeão!</h3>
              <p className="text-xs font-semibold text-purple-200 leading-relaxed">
                Você encontrou todos os pares em apenas <strong className="text-white">{memoryMoves} movimentos</strong>!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-sm">
                <span>🪙 +75 Moedas</span>
                <span>•</span>
                <span>⚡ +150 XP</span>
              </div>
              <div>
                <Button onClick={restartMemory} className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-md gap-2">
                  <RotateCcw className="w-4 h-4" /> Jogar Novamente
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          JOGO 2: REFLEXO RÁPIDO (SPEED TAP)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "reflexo" && (
        <div className={`rounded-3xl p-5 sm:p-7 border shadow-lg space-y-6 ${cardBgClass} ${cardBorderClass}`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className={`text-lg font-black flex items-center gap-2 ${textPrimaryClass}`}>
                <Zap className="w-5 h-5 text-emerald-400" /> Reflexo Rápido: Caça aos Hábitos Saudáveis
              </h2>
              <p className={`text-xs font-semibold mt-0.5 ${textSecondaryClass}`}>
                Clique rápido nos itens saudáveis (+10 pts) e evite frituras e açúcares (-5 pts) em 30 segundos!
              </p>
            </div>
            {reflexActive && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-xs">
                  <Timer className="w-3.5 h-3.5 animate-spin" />
                  <span>{reflexTimeLeft}s</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs">
                  Score: {reflexScore}
                </div>
              </div>
            )}
          </div>

          {!reflexActive && !reflexFinished ? (
            <div className="p-8 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center text-3xl">
                ⚡
              </div>
              <h3 className={`text-xl font-black ${textPrimaryClass}`}>Preparado para o Desafio?</h3>
              <p className={`text-xs font-semibold ${textSecondaryClass}`}>
                Itens saudáveis e não saudáveis surgirão aleatoriamente na grade. Seja rápido no toque!
              </p>
              <Button
                onClick={startReflexGame}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Iniciar Desafio de 30s
              </Button>
            </div>
          ) : reflexActive ? (
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {reflexTiles.map((tile, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleTileClick(i)}
                  className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all select-none ${
                    tile.type === "healthy"
                      ? "bg-emerald-600/30 border-emerald-400 shadow-md scale-105 animate-pulse"
                      : tile.type === "unhealthy"
                        ? "bg-rose-600/30 border-rose-400 shadow-md scale-105 animate-bounce"
                        : "bg-slate-900/60 border-slate-800"
                  }`}
                >
                  {tile.type !== "empty" ? (
                    <div className="flex flex-col items-center gap-1 animate-in zoom-in duration-150">
                      <span className="text-3xl sm:text-4xl">{tile.icon}</span>
                      <span
                        className={`text-[10px] font-black leading-tight ${
                          tile.type === "healthy" ? "text-emerald-300" : "text-rose-300"
                        }`}
                      >
                        {tile.label}
                      </span>
                    </div>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700/50" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-emerald-950/40 border-2 border-emerald-500/50 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center text-3xl animate-bounce">
                🎉
              </div>
              <h3 className="text-2xl font-black text-white">Tempo Esgotado!</h3>
              <p className="text-xs font-semibold text-emerald-200">
                Sua pontuação final foi de <strong className="text-white text-base">{reflexScore} pontos</strong>!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-sm">
                <span>🪙 +{Math.max(20, Math.floor(reflexScore * 3))} Moedas</span>
                <span>•</span>
                <span>⚡ +{Math.max(40, Math.floor(reflexScore * 6))} XP</span>
              </div>
              <div>
                <Button onClick={startReflexGame} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md gap-2">
                  <RotateCcw className="w-4 h-4" /> Jogar Novamente
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          JOGO 3: ROLETA DA SAÚDE DIÁRIA
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "roleta" && (
        <div className={`rounded-3xl p-5 sm:p-7 border shadow-lg space-y-6 ${cardBgClass} ${cardBorderClass}`}>
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className={`text-xl font-black flex items-center justify-center gap-2 ${textPrimaryClass}`}>
              <Sparkles className="w-6 h-6 text-rose-400" /> Roleta da Sorte Diária
            </h2>
            <p className={`text-xs font-semibold ${textSecondaryClass}`}>
              Gire uma vez ao dia para concorrer a pacotes de moedas e impulsos gigantescos de XP!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            {/* Visual da Roleta */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Ponteiro superior */}
              <div className="absolute -top-3 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 filter drop-shadow-md" />

              {/* Disco Giratório com 6 fatias coloridas */}
              <div
                className="w-full h-full rounded-full border-4 border-slate-700 shadow-2xl relative overflow-hidden transition-transform ease-out"
                style={{
                  transform: `rotate(${spinDeg}deg)`,
                  transitionDuration: spinning ? "3.8s" : "0s",
                  background: "conic-gradient(#10b981 0deg 60deg, #8b5cf6 60deg 120deg, #f59e0b 120deg 180deg, #06b6d4 180deg 240deg, #ec4899 240deg 300deg, #e11d48 300deg 360deg)",
                }}
              >
                {/* Textos das fatias */}
                {WHEEL_SEGMENTS.map((seg, idx) => (
                  <div
                    key={idx}
                    className="absolute w-full h-full flex items-start justify-center pt-3 text-white font-black text-[11px] sm:text-xs select-none shadow-sm"
                    style={{
                      transform: `rotate(${idx * 60 + 30}deg)`,
                    }}
                  >
                    <span className="bg-black/30 px-2 py-0.5 rounded-full shadow">{seg.label}</span>
                  </div>
                ))}
              </div>

              {/* Botão Central do Eixo */}
              <div className="absolute z-20 w-16 h-16 rounded-full bg-slate-950 border-4 border-amber-400 flex items-center justify-center text-xl shadow-inner select-none font-black text-amber-400">
                🎁
              </div>
            </div>

            {/* Resultado do Giro */}
            {wheelResult && (
              <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 text-center animate-in zoom-in duration-300 max-w-xs w-full">
                <div className="text-xs font-black text-amber-300 uppercase">Parabéns! Você ganhou:</div>
                <div className="text-xl font-black text-white mt-0.5">{wheelResult.label}</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  +{wheelResult.coins} Moedas • +{wheelResult.xp} XP
                </div>
              </div>
            )}

            <Button
              onClick={spinWheel}
              disabled={spinning}
              className={`px-8 py-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all ${
                spinning
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 hover:scale-105 active:scale-95 shadow-rose-600/30"
              }`}
            >
              {spinning ? "Girando a Roleta..." : "GIRAR A ROLETA AGORA! 🎰"}
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          JOGO 4: QUIZ DA SAÚDE
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "quiz" && (
        <Card className={`border shadow-lg ${cardBgClass} ${cardBorderClass}`}>
          <CardHeader>
            <CardTitle className={`text-xl flex items-center gap-2 ${textPrimaryClass}`}>
              <HelpCircle className="w-5 h-5 text-cyan-400" /> Desafio Quiz FarmaHero
            </CardTitle>
            <CardDescription className={textSecondaryClass}>
              Responda às perguntas sobre hábitos e cuidados diários para ganhar até 125 Moedas e 250 XP!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!quizFinished ? (
              <div className="p-5 sm:p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>
                    Pergunta {quizIdx + 1} de {QUIZ_QUESTIONS.length}
                  </span>
                  <Badge variant="emerald">Acertos: {quizScore}</Badge>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {QUIZ_QUESTIONS[quizIdx].question}
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {QUIZ_QUESTIONS[quizIdx].options.map((opt, idx) => {
                    const isPicked = selectedOption === idx;
                    const isRight = idx === QUIZ_QUESTIONS[quizIdx].correct;

                    let btnStyle = "bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400";
                    if (selectedOption !== null) {
                      if (isRight) {
                        btnStyle = "bg-emerald-600 text-white border-emerald-500 shadow-md";
                      } else if (isPicked) {
                        btnStyle = "bg-rose-600 text-white border-rose-500";
                      } else {
                        btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedOption !== null}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm font-semibold ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-black/40 text-xs font-black flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {selectedOption !== null && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                        {selectedOption !== null && isPicked && !isRight && <XCircle className="w-4 h-4 text-rose-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 animate-in fade-in">
                    💡 <strong>Explicação:</strong> {QUIZ_QUESTIONS[quizIdx].explanation}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-950/60 border border-cyan-500/40 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mx-auto flex items-center justify-center text-3xl animate-bounce">
                  🎉
                </div>
                <h3 className="text-2xl font-black text-white">Quiz Concluído!</h3>
                <p className="text-xs font-semibold text-slate-300">
                  Você acertou <span className="font-black text-emerald-400 text-sm">{quizScore}</span> de{" "}
                  {QUIZ_QUESTIONS.length} perguntas.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-sm">
                  <span>🪙 +{quizScore * 25} Moedas</span>
                  <span>•</span>
                  <span>⚡ +{quizScore * 50} XP</span>
                </div>
                <div>
                  <Button onClick={restartQuiz} className="bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl shadow-md gap-2">
                    <RotateCcw className="w-4 h-4" /> Jogar Novamente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
