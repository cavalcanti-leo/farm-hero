import React from "react";
import { useState } from "react";
import { Link } from "wouter";
import { useAppState, MealEntry } from "@/lib/app-state";
import { Utensils, Plus, ArrowLeft, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export const SaudeAlimentacaoRoute: React.FC = () => {
  const { meals, addMeal } = useAppState();
  const [name, setName] = useState("");
  const [type, setType] = useState<MealEntry["type"]>("café");
  const [calories, setCalories] = useState<number>(300);

  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMeal({ name, type, calories });
    setName("");
    setCalories(300);
  };

  return (
    <div className="p-4 space-y-4 font-sans text-slate-900 animate-in fade-in duration-200">
      <Link
        href="/saude"
        className="inline-flex items-center gap-1 text-xs font-black text-purple-700 bg-white border-2 border-indigo-950 px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 transition-all"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para Saúde
      </Link>

      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-5 shadow-[4px_4px_0px_#1e1b4b] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-400 border-3 border-indigo-950 flex items-center justify-center text-white shrink-0">
            <Utensils className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-black text-indigo-950">Alimentação & Nutrição</h1>
            <p className="text-xs text-slate-500 font-bold">Total hoje: {totalCalories} kcal</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-emerald-50 p-4 rounded-2xl border-3 border-indigo-950"
        >
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
            Nova Refeição:
          </h3>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do alimento..."
            required
            className="border-2 border-indigo-950 text-xs font-bold bg-white text-indigo-950 placeholder:text-slate-400"
          />
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as "café" | "almoço" | "jantar" | "lanche")}
              className="border-2 border-indigo-950 text-xs font-bold bg-white text-indigo-950 [&>option]:bg-white [&>option]:text-indigo-950"
            >
              <option value="café" className="bg-white text-indigo-950 font-bold">
                Café da Manhã
              </option>
              <option value="almoço" className="bg-white text-indigo-950 font-bold">
                Almoço
              </option>
              <option value="jantar" className="bg-white text-indigo-950 font-bold">
                Jantar
              </option>
              <option value="lanche" className="bg-white text-indigo-950 font-bold">
                Lanche
              </option>
            </Select>
            <Input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              placeholder="kcal"
              className="border-2 border-indigo-950 text-xs font-bold bg-white text-indigo-950 placeholder:text-slate-400"
            />
          </div>
          <Button
            type="submit"
            variant="emerald"
            className="w-full border-3 border-indigo-950 font-black text-xs"
          >
            <Apple className="w-4 h-4 mr-1 stroke-[3]" /> Salvar Refeição
          </Button>
        </form>

        <div className="space-y-2">
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
            Refeições Registradas:
          </h3>
          {meals.map((m) => (
            <div
              key={m.id}
              className="p-3 bg-slate-50 border-2 border-indigo-950 rounded-2xl flex justify-between items-center text-xs font-black"
            >
              <div>
                <p className="text-indigo-950">{m.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {m.type} • {m.time}
                </p>
              </div>
              <span className="text-emerald-600 font-extrabold">{m.calories} kcal</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
