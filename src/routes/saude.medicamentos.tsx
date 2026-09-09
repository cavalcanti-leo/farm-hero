import React, { useState } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { useTheme } from "@/lib/theme-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, ArrowLeft, CheckCircle2 } from "lucide-react";

export const SaudeMedicamentosRoute: React.FC = () => {
  const { medications, addMedication, toggleMedication } = useAppState();
  const {
    pageBgClass,
    cardBgClass,
    cardBorderClass,
    buttonClass,
    textPrimaryClass,
    textSecondaryClass,
    inputBg,
    inputBorder,
    inputText,
    inputPlaceholder,
    bgStyle,
  } = useTheme();

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

  const inputCls = `${inputBg} ${inputBorder} ${inputText} ${inputPlaceholder}`;

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 min-h-full ${pageBgClass} ${textPrimaryClass}`} style={bgStyle}>
      <div className="flex items-center justify-between">
        <Link
          href="/saude"
          className={`inline-flex items-center gap-1 text-xs font-black px-4 py-2 rounded-full active:translate-y-0.5 transition-all ${buttonClass}`}
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para Saúde
        </Link>
      </div>

      <div className={`p-6 border-2 transition-all ${cardBgClass} ${cardBorderClass}`}>
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Pill className="w-8 h-8 text-purple-400" /> Gestão de Medicamentos & Vitaminas
          </h2>
          <p className={`text-xs font-semibold ${textSecondaryClass}`}>
            Organize seus remédios diários e receba confirmações de dosagem.
          </p>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className={`p-4 rounded-2xl border-2 space-y-4 ${cardBgClass} ${cardBorderClass}`}
          >
            <h3 className="text-sm font-black flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Cadastrar Novo Medicamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={`text-xs font-bold mb-1 block ${textSecondaryClass}`}>
                  Nome do Medicamento
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Vitamina C / Dipirona"
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={`text-xs font-bold mb-1 block ${textSecondaryClass}`}>
                  Dose / Quantidade
                </label>
                <Input
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Ex: 500mg / 1 comprimido"
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={`text-xs font-bold mb-1 block ${textSecondaryClass}`}>
                  Horário Previsto
                </label>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="purple" className="w-full gap-2 font-black text-sm py-3">
              <Pill className="w-4 h-4" /> Cadastrar Remédio
            </Button>
          </form>

          <div className="space-y-3">
            <h3 className="text-sm font-black">Lista de Medicamentos</h3>
            {medications.map((med) => (
              <div
                key={med.id}
                onClick={() => toggleMedication(med.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  med.taken
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300"
                    : `${cardBgClass} ${cardBorderClass} hover:opacity-90`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center border-2 ${
                      med.taken
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : "border-gray-400"
                    }`}
                  >
                    {med.taken && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-base font-black">
                      {med.name} <span className={`text-xs ${textSecondaryClass}`}>({med.dosage})</span>
                    </p>
                    <p className={`text-xs font-semibold ${textSecondaryClass}`}>Horário: {med.scheduledTime}</p>
                  </div>
                </div>
                <Badge variant={med.taken ? "emerald" : "outline"} className="font-bold">
                  {med.taken ? "Tomado (+35 XP)" : "Marcar como tomado"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
