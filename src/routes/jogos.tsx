import React, { useState } from "react";
import { useAppState } from "@/lib/app-state";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Sparkles, Trophy, RotateCcw, Heart, CheckCircle2, XCircle } from "lucide-react";

export const JogosRoute: React.FC = () => {
  const { gainXpAndCoins } = useAppState();

  // State for Health Quiz Game
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = [
    {
      question: "Qual é a quantidade recomendada diária aproximada de água para um adulto saudável?",
      options: ["500 ml", "1,5 a 2,5 litros", "5 litros", "10 litros"],
      correct: 1,
    },
    {
      question: "Qual hábito ajuda a melhorar a qualidade do sono profundo?",
      options: [
        "Usar celular na cama com brilho máximo",
        "Tomar café expresso às 22h",
        "Manter o quarto escuro e sem telas antes de dormir",
        "Fazer exercícios exaustivos 5 minutos antes de deitar",
      ],
      correct: 2,
    },
    {
      question: "Qual grupo de alimentos é essencial para a saúde muscular e reparação de tecidos?",
      options: ["Proteínas", "Açúcares refinados", "Gorduras trans", "Refrigerantes"],
      correct: 0,
    },
  ];

  const handleAnswer = (optionIdx: number) => {
    if (optionIdx === quizQuestions[currentQuiz].correct) {
      setScore((prev) => prev + 1);
    }
    if (currentQuiz + 1 < quizQuestions.length) {
      setCurrentQuiz((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      const earnedCoins = (score + 1) * 20;
      const earnedXp = (score + 1) * 40;
      gainXpAndCoins(earnedXp, earnedCoins, "Completou o Quiz de Saúde FarmHero!");
    }
  };

  const restartQuiz = () => {
    setCurrentQuiz(0);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-cyan-400" /> Arcade & Mini-Jogos FarmHero
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Divirta-se com jogos educativos para acumular moedas extras e evoluir o seu herói!
          </p>
        </div>
      </div>

      {/* Quiz Game Container */}
      <Card className="border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-cyan-400">
            <Trophy className="w-5 h-5" /> Desafio Quiz da Saúde
          </CardTitle>
          <CardDescription>
            Responda corretamente às perguntas sobre hábitos saudáveis para ganhar até 100 Moedas!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!quizFinished ? (
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Pergunta {currentQuiz + 1} de {quizQuestions.length}</span>
                <Badge variant="emerald">Pontuação atual: {score}</Badge>
              </div>

              <h3 className="text-lg font-bold text-white leading-relaxed">
                {quizQuestions[currentQuiz].question}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {quizQuestions[currentQuiz].options.map((opt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => handleAnswer(idx)}
                    className="justify-start h-auto py-3.5 px-4 text-left font-medium text-slate-200 hover:border-cyan-400 hover:text-white"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center mr-3 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-950 rounded-2xl border border-cyan-500/40 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center text-3xl animate-bounce">
                🎉
              </div>
              <h3 className="text-2xl font-extrabold text-white">Quiz Concluído!</h3>
              <p className="text-slate-300">
                Você acertou <span className="font-extrabold text-emerald-400">{score}</span> de {quizQuestions.length} perguntas.
              </p>
              <Button onClick={restartQuiz} variant="emerald" className="gap-2">
                <RotateCcw className="w-4 h-4" /> Jogar Novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
