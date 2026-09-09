import React from "react";
import { useState } from "react";
import { Link } from "wouter";
import { useAppState, GlucoseEntry } from "@/lib/app-state";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Activity, Plus, ArrowLeft, HeartPulse } from "lucide-react";

export const SaudeGlicemiaRoute: React.FC = () => {
  const { glucoseLogs, addGlucose } = useAppState();
  const [value, setValue] = useState<number>(95);
  const [timing, setTiming] = useState<GlucoseEntry["timing"]>("Jejum");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGlucose({ value, timing });
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3 text-red-400">
              <Activity className="w-8 h-8" /> Controle de Glicemia
            </CardTitle>
            <CardDescription>
              Monitore os níveis de glicose no sangue ao longo do dia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-400" /> Nova Medição
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">
                    Valor da Glicemia (mg/dL)
                  </label>
                  <Input
                    type="number"
                    min="30"
                    max="600"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">
                    Momento do Dia
                  </label>
                  <Select
                    value={timing}
                    onChange={(e) =>
                      setTiming(
                        e.target.value as
                          "Jejum" | "Pré-refeição" | "Pós-refeição" | "Antes de dormir",
                      )
                    }
                  >
                    <option value="Jejum">Jejum</option>
                    <option value="Pré-refeição">Pré-refeição</option>
                    <option value="Pós-refeição">Pós-refeição</option>
                    <option value="Antes de dormir">Antes de dormir</option>
                  </Select>
                </div>
              </div>

              <Button type="submit" variant="destructive" className="w-full gap-2">
                <Activity className="w-4 h-4" /> Salvar Medição (+25 XP)
              </Button>
            </form>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300">Histórico de Glicemia</h3>
              {glucoseLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{log.value} mg/dL</p>
                      <p className="text-xs text-slate-400">
                        {log.timing} • {log.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      log.value < 70
                        ? "bg-amber-500/20 text-amber-300"
                        : log.value <= 140
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {log.value < 70 ? "Baixa" : log.value <= 140 ? "Normal" : "Elevada"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
