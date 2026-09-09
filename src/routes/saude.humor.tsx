import React from "react";
import { useState } from "react";
import { Link } from "wouter";
import { useAppState, MoodEntry } from "@/lib/app-state";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, ArrowLeft, Heart } from "lucide-react";

export const SaudeHumorRoute: React.FC = () => {
  const { moodLogs, addMood } = useAppState();
  const [selectedMood, setSelectedMood] = useState<MoodEntry["mood"]>("Bem");
  const [note, setNote] = useState("");

  const moodsList: { label: MoodEntry["mood"]; emoji: string; color: string }[] = [
    { label: "Ótimo", emoji: "🤩", color: "from-amber-400 to-yellow-500" },
    { label: "Bem", emoji: "😊", color: "from-emerald-400 to-teal-500" },
    { label: "Neutro", emoji: "😐", color: "from-blue-400 to-indigo-500" },
    { label: "Cansado", emoji: "😴", color: "from-purple-400 to-pink-500" },
    { label: "Estressado", emoji: "😤", color: "from-red-400 to-rose-500" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMood({ mood: selectedMood, note });
    setNote("");
  };

  return (
    <div className="p-4 space-y-4 font-sans text-slate-900 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <Link
          href="/saude"
          className="inline-flex items-center gap-1 text-xs font-black text-purple-700 bg-white border-2 border-indigo-950 px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para Saúde
        </Link>
      </div>

      <Card className="border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-yellow-400">
            <Smile className="w-8 h-8" /> Diário de Humor & Sentimentos
          </CardTitle>
          <CardDescription>
            Como você está se sentindo agora? Registre sua energia mental e emocional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-200">Escolha o seu Estado Emocional:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {moodsList.map((m) => (
                <button
                  type="button"
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    selectedMood === m.label
                      ? "bg-slate-900 border-yellow-500 shadow-lg scale-105"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className="text-3xl mb-1">{m.emoji}</span>
                  <span className="text-xs font-bold text-slate-200">{m.label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">
                Nota ou Observação (Opcional)
              </label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Tive uma boa caminhada pela manhã..."
              />
            </div>

            <Button type="submit" variant="amber" className="w-full gap-2">
              <Heart className="w-4 h-4" /> Registrar Humor (+20 XP)
            </Button>
          </form>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300">Registros Recentes de Humor</h3>
            {moodLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800"
              >
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    {moodsList.find((m) => m.label === log.mood)?.emoji} {log.mood}
                  </p>
                  {log.note && <p className="text-xs text-slate-400 mt-0.5">{log.note}</p>}
                </div>
                <span className="text-xs text-slate-500 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
