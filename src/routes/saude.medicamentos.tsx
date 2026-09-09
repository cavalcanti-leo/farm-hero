import React, { useState } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, ArrowLeft, CheckCircle2 } from "lucide-react";

export const SaudeMedicamentosRoute: React.FC = () => {
  const { medications, addMedication, toggleMedication } = useAppState();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("08:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMedication({ name, dosage, scheduledTime });
    setName("");
    setDosage("");
  };

  return (
    <div className="p-4 space-y-4 font-sans text-slate-900 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <Link href="/saude" className="inline-flex items-center gap-1 text-xs font-black text-purple-700 bg-white border-2 border-indigo-950 px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 transition-all">
          <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para Saúde
        </Link>
      </div>

      <Card className="border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-pink-400">
            <Pill className="w-8 h-8" /> Gestão de Medicamentos & Vitaminas
          </CardTitle>
          <CardDescription>
            Organize seus remédios diários e receba confirmações de dosagem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Plus className="w-4 h-4 text-pink-400" /> Cadastrar Novo Medicamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Nome do Medicamento</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Vitamina C / Dipirona"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Dose / Quantidade</label>
                <Input
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Ex: 500mg / 1 comprimido"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Horário Previsto</label>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="purple" className="w-full gap-2">
              <Pill className="w-4 h-4" /> Cadastrar Remédio
            </Button>
          </form>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300">Lista de Medicamentos</h3>
            {medications.map((med) => (
              <div
                key={med.id}
                onClick={() => toggleMedication(med.id)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  med.taken
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                    : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                    med.taken ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-600"
                  }`}>
                    {med.taken && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-base font-bold">{med.name} <span className="text-xs text-slate-400">({med.dosage})</span></p>
                    <p className="text-xs text-slate-400">Horário: {med.scheduledTime}</p>
                  </div>
                </div>
                <Badge variant={med.taken ? "emerald" : "outline"}>
                  {med.taken ? "Tomado (+35 XP)" : "Marcar como tomado"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
