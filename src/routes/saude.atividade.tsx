import React from "react";
import { useState } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { Dumbbell, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SaudeAtividadeRoute: React.FC = () => {
  const { activities, addActivity } = useAppState();
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(200);

  const totalBurned = activities.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addActivity({ title, durationMinutes, caloriesBurned });
    setTitle("");
  };

  return (
    <div className="p-4 space-y-4 font-sans text-slate-900 animate-in fade-in duration-200">
      <Link
        href="/saude"
        className="inline-flex items-center gap-1 text-xs font-black text-purple-700 bg-white border-2 border-indigo-950 px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#1e1b4b]"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para Saúde
      </Link>

      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-5 shadow-[4px_4px_0px_#1e1b4b] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-3 border-indigo-950 flex items-center justify-center text-white shrink-0">
            <Dumbbell className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-black text-indigo-950">Atividades Físicas</h1>
            <p className="text-xs text-slate-500 font-bold">Total queimado: {totalBurned} kcal</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-amber-50 p-4 rounded-2xl border-3 border-indigo-950"
        >
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
            Novo Treino:
          </h3>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Musculação / Caminhada"
            required
            className="border-2 border-indigo-950 text-xs font-bold bg-black text-indigo-950 placeholder:text-slate-400"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              placeholder="Minutos"
              className="border-2 border-indigo-950 text-xs font-bold bg-black text-indigo-950 placeholder:text-slate-400"
            />
            <Input
              type="number"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(Number(e.target.value))}
              placeholder="kcal queimadas"
              className="border-2 border-indigo-950 text-xs font-bold bg-black text-indigo-950 placeholder:text-slate-400"
            />
          </div>
          <Button
            type="submit"
            variant="amber"
            className="w-full border-3 border-indigo-950 font-black text-xs"
          >
            <Plus className="w-4 h-4 mr-1 stroke-[3]" /> Concluir Treino (+50 XP)
          </Button>
        </form>

        <div className="space-y-2">
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
            Treinos de Hoje:
          </h3>
          {activities.map((a) => (
            <div
              key={a.id}
              className="p-3 bg-slate-50 border-2 border-indigo-950 rounded-2xl flex justify-between items-center text-xs font-black"
            >
              <div>
                <p className="text-indigo-950">{a.title}</p>
                <p className="text-[10px] text-slate-400">
                  {a.durationMinutes} min • {a.time}
                </p>
              </div>
              <span className="text-amber-600 font-extrabold">-{a.caloriesBurned} kcal</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
