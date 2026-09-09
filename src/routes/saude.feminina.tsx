import React, { useState } from "react";
import { Link } from "wouter";
import { useAppState, FemaleLog } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sparkles, ArrowLeft, Heart, Calendar, Plus, Info, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

// Common symptoms, description and recommended remedies
const SYMPTOM_REMEDIES: Record<string, { remedies: string[]; natural: string; description: string }> = {
  "Cólica": {
    remedies: ["Ibuprofeno", "Buscopan", "Ponstan (Ácido Mefenâmico)"],
    natural: "Bolsa de água quente no abdômen, chá de camomila ou gengibre, repouso e alongamentos leves.",
    description: "Dores ou espasmos na região pélvica causados por contrações do útero."
  },
  "Dor de Cabeça": {
    remedies: ["Neosaldina", "Paracetamol", "Dipirona"],
    natural: "Repouso em local escuro, compressa fria na testa, hidratação reforçada e chá de hortelã.",
    description: "Cefaleia de origem hormonal decorrente da oscilação de estrogênio."
  },
  "Inchaço": {
    remedies: ["Suplemento de Magnésio", "Dimeticona (para gases associados)"],
    natural: "Chá de cavalinha ou hibisco, redução no sal, beber bastante água e caminhadas leves.",
    description: "Retenção hídrica típica provocada pelo aumento da progesterona."
  },
  "Mudança de Humor": {
    remedies: ["Passiflora (Maracujá)", "Valeriana", "Suplemento de Vitamina B6"],
    natural: "Exercícios físicos moderados, meditação, chá de erva-cidreira e sono de qualidade.",
    description: "Ansiedade, irritabilidade ou desânimo provocados pela flutuação hormonal pré-menstruais."
  },
  "Fadiga / Cansaço": {
    remedies: ["Complexo B", "Magnésio Quelato", "Vitamina D3"],
    natural: "Cochilo rápido (máximo 20 min), boa noite de sono, evitar cafeína em excesso e hidratação.",
    description: "Falta de energia comum na transição de fases do ciclo menstrual."
  },
  "Sensibilidade nos Seios": {
    remedies: ["Ibuprofeno (se dor persistente)"],
    natural: "Usar sutiãs confortáveis sem aros rígidos, compressa fria local e cortar a cafeína.",
    description: "Sensação de peso e dor mamária decorrentes do pico de progesterona e prolactina."
  },
  "Acne Hormonal": {
    remedies: ["Gel de Peróxido de Benzoíla", "Sabonete com Ácido Salicílico"],
    natural: "Compressa morna com chá verde, redução do consumo de doces/laticínios e argila verde.",
    description: "Erupções cutâneas associadas ao aumento de oleosidade da pele nas fases pré-menstruais."
  }
};

export const SaudeFemininaRoute: React.FC = () => {
  const { femaleLog, updateFemaleLog } = useAppState();
  const [cycleDay, setCycleDay] = useState<number>(femaleLog.cycleDay);
  const [flow, setFlow] = useState<FemaleLog["flow"]>(femaleLog.flow);
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomsList, setSymptomsList] = useState<string[]>(femaleLog.symptoms);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  const handleAddSymptom = () => {
    if (!symptomInput.trim()) return;
    const cleanSymptom = symptomInput.trim();
    if (!symptomsList.includes(cleanSymptom)) {
      setSymptomsList([...symptomsList, cleanSymptom]);
      // If the custom input matches a common symptom, select it for recommendation
      const match = Object.keys(SYMPTOM_REMEDIES).find(k => k.toLowerCase() === cleanSymptom.toLowerCase());
      if (match) {
        setSelectedSymptom(match);
      }
    }
    setSymptomInput("");
  };

  const handleToggleCommonSymptom = (symptomName: string) => {
    let updated: string[];
    if (symptomsList.includes(symptomName)) {
      updated = symptomsList.filter(s => s !== symptomName);
      if (selectedSymptom === symptomName) {
        setSelectedSymptom(null);
      }
    } else {
      updated = [...symptomsList, symptomName];
      setSelectedSymptom(symptomName); // Show remedies immediately when selecting
    }
    setSymptomsList(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFemaleLog({
      cycleDay,
      flow,
      symptoms: symptomsList,
    });
    toast.success("Registro de saúde feminina atualizado!", {
      description: `Dia do ciclo: ${cycleDay} | Fluxo: ${flow} | Sintomas: ${symptomsList.length}`
    });
  };

  const getDayPhase = (day: number) => {
    if (day >= 1 && day <= 5) {
      return { 
        name: "Menstruação", 
        color: "bg-rose-100 border-rose-500 text-rose-800",
        desc: "Fase de sangramento menstrual. Os hormônios estão nos níveis mais baixos." 
      };
    }
    if (day >= 12 && day <= 16) {
      return { 
        name: "Período Fértil / Ovulação", 
        color: "bg-teal-100 border-teal-500 text-teal-800",
        desc: "Estrogênio no pico! Período com maior chance de gravidez (ovulação estimada no dia 14)." 
      };
    }
    if (day >= 21 && day <= 28) {
      return { 
        name: "Fase Lútea / TPM", 
        color: "bg-purple-100 border-purple-500 text-purple-800",
        desc: "Progesterona elevada. Período clássico dos sintomas físicos e emocionais da TPM." 
      };
    }
    return { 
      name: "Fase Folicular", 
      color: "bg-slate-50 border-slate-300 text-slate-700",
      desc: "Corpo se preparando para liberar o óvulo. Níveis de energia tendem a subir." 
    };
  };

  const activePhase = getDayPhase(cycleDay);

  return (
    <div className="p-4 space-y-4 font-sans text-slate-900 animate-in fade-in duration-200">
      {/* Barra Superior */}
      <div className="flex items-center justify-between">
        <Link href="/saude" className="inline-flex items-center gap-1 text-xs font-black text-purple-700 bg-white border-2 border-indigo-950 px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 transition-all">
          <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para Saúde
        </Link>
      </div>

      {/* Card Principal */}
      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-5 shadow-[4px_4px_0px_#1e1b4b] space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-400 border-3 border-indigo-950 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-black text-indigo-950">Saúde Feminina</h1>
            <p className="text-xs text-slate-500 font-bold">Monitore o ciclo, fluxo e receba dicas de alívio</p>
          </div>
        </div>

        {/* Calendário Interativo do Ciclo (28 dias) */}
        <div className="space-y-3 bg-rose-50/40 p-4 border-3 border-indigo-950 rounded-2xl">
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-rose-500" /> Calendário do Ciclo (28 Dias)
          </h3>
          
          <div className="grid grid-cols-7 gap-1.5 justify-items-center">
            {Array.from({ length: 28 }, (_, i) => {
              const day = i + 1;
              const phase = getDayPhase(day);
              const isCurrent = cycleDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setCycleDay(day)}
                  className={`w-9 h-9 rounded-full border-2 font-black text-xs flex items-center justify-center transition-all ${
                    isCurrent 
                      ? "bg-indigo-950 border-indigo-950 text-white scale-110 shadow-[2px_2px_0px_#f43f5e]" 
                      : `${phase.color} hover:scale-105 active:scale-95`
                  }`}
                  title={`Dia ${day}: ${phase.name}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legenda do Calendário */}
          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t-2 border-slate-200 text-[9px] font-black text-slate-500 leading-none">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-rose-100 border-2 border-rose-500 inline-block shrink-0" />
              <span>Menstruação (1-5)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-slate-50 border-2 border-slate-300 inline-block shrink-0" />
              <span>Fase Folicular (6-11)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-teal-100 border-2 border-teal-500 inline-block shrink-0" />
              <span>Período Fértil (12-16)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-purple-100 border-2 border-purple-500 inline-block shrink-0" />
              <span>Fase Lútea / TPM (17-28)</span>
            </div>
          </div>
        </div>

        {/* Banner informativo da fase ativa */}
        <div className="p-3 bg-slate-50 border-3 border-indigo-950 rounded-2xl flex items-start gap-2.5 text-xs font-bold shadow-[2px_2px_0px_#1e1b4b]">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest block">Status do Dia {cycleDay}</span>
            <p className="font-black text-indigo-950 mt-0.5">Fase: {activePhase.name}</p>
            <p className="font-bold text-[10px] text-slate-500 mt-0.5 leading-relaxed">{activePhase.desc}</p>
          </div>
        </div>

        {/* Formulário de Registro Diário */}
        <form onSubmit={handleSave} className="bg-slate-50 border-3 border-indigo-950 p-4 rounded-2xl space-y-4">
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500" /> Registrar Fluxo e Sintomas
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[10px] font-black text-slate-600 mb-1 block">Dia do Ciclo</label>
              <Input
                type="number"
                min="1"
                max="45"
                value={cycleDay}
                onChange={(e) => setCycleDay(Number(e.target.value))}
                className="bg-white border-3 border-indigo-950 rounded-xl text-xs font-black text-indigo-950 placeholder:text-slate-400"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-600 mb-1 block">Fluxo Menstrual</label>
              <Select 
                value={flow} 
                onChange={(e) => setFlow(e.target.value as any)}
                className="bg-white border-3 border-indigo-950 rounded-xl text-xs font-black text-indigo-950"
              >
                <option value="Nenhum">Nenhum</option>
                <option value="Leve">Leve</option>
                <option value="Moderado">Moderado</option>
                <option value="Intenso">Intenso</option>
              </Select>
            </div>
          </div>

          {/* Seletor de Sintomas Comuns */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 block">Selecione os Sintomas Comuns (Clique para ver recomendações):</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(SYMPTOM_REMEDIES).map((symptom) => {
                const isActive = symptomsList.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleToggleCommonSymptom(symptom)}
                    className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl border-2 border-indigo-950 shadow-[1px_1px_0px_#1e1b4b] transition-all active:translate-y-0.5 flex items-center gap-1 ${
                      isActive 
                        ? "bg-rose-500 text-white shadow-[0px_0px_0px_#1e1b4b] translate-y-0.5" 
                        : "bg-white text-indigo-950 hover:bg-rose-50"
                    }`}
                  >
                    {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo para sintoma personalizado */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-600 block">Outro Sintoma ou Sensação:</label>
            <div className="flex gap-2">
              <Input
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Ex: Espinhas / Ansiedade leve..."
                className="bg-white border-3 border-indigo-950 rounded-xl text-xs font-black text-indigo-950 placeholder:text-slate-400 flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddSymptom} 
                className="border-3 border-indigo-950 bg-slate-200 hover:bg-slate-300 text-indigo-950 font-black text-xs px-3 shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Adicionar
              </Button>
            </div>
          </div>

          {/* Salvar dados */}
          <Button type="submit" className="w-full border-3 border-indigo-950 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs py-2.5 shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 transition-all">
            <Heart className="w-4 h-4 mr-1.5" /> Salvar Dados do Ciclo (+25 XP)
          </Button>
        </form>

        {/* Recomendação de Medicamentos/Remédios baseada no sintoma selecionado */}
        {selectedSymptom && SYMPTOM_REMEDIES[selectedSymptom] && (
          <div className="bg-rose-50 border-3 border-indigo-950 rounded-2xl p-4 space-y-3 animate-in slide-in-from-bottom duration-300 shadow-[2px_2px_0px_#1e1b4b]">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                💊 Recomendação para: {selectedSymptom}
              </h3>
              <button 
                type="button" 
                onClick={() => setSelectedSymptom(null)}
                className="text-[9px] font-black text-indigo-950 bg-white border-2 border-indigo-950 px-2 py-0.5 rounded-lg active:scale-95 transition-all"
              >
                Fechar X
              </button>
            </div>
            
            <p className="text-[11px] font-bold text-rose-900 leading-relaxed bg-white/50 p-2.5 rounded-xl border border-rose-200">
              {SYMPTOM_REMEDIES[selectedSymptom].description}
            </p>

            <div className="space-y-2.5 pt-1 border-t border-rose-200">
              <div>
                <span className="text-[10px] font-black text-indigo-950 block">💊 Medicamentos Úteis sugeridos:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {SYMPTOM_REMEDIES[selectedSymptom].remedies.map((remedy, i) => (
                    <span key={i} className="text-[10px] font-black bg-white border-2 border-indigo-950 px-2 py-0.5 rounded-md text-indigo-950 shadow-[1px_1px_0px_#1e1b4b]">
                      {remedy}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-emerald-800 block">🌿 Métodos e Chás Naturais:</span>
                <p className="text-[11px] font-bold text-emerald-950 leading-relaxed mt-0.5 bg-white/50 p-2.5 rounded-xl border border-emerald-200">
                  {SYMPTOM_REMEDIES[selectedSymptom].natural}
                </p>
              </div>
            </div>

            <p className="text-[9px] font-bold text-slate-400 leading-relaxed text-center italic pt-1 border-t border-rose-200 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              Sempre leia a bula. Em caso de persistência ou dores graves, consulte seu médico.
            </p>
          </div>
        )}
      </div>

      {/* Histórico e Registro de Hoje */}
      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-4 shadow-[4px_4px_0px_#1e1b4b] space-y-3">
        <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Histórico de Hoje</h3>
        <div className="space-y-2 text-xs font-black">
          <div className="p-3 bg-slate-50 border-2 border-indigo-950 rounded-xl flex items-center justify-between">
            <span className="text-slate-500">Dia Atual do Ciclo:</span>
            <span className="text-rose-600">Dia {femaleLog.cycleDay}</span>
          </div>
          <div className="p-3 bg-slate-50 border-2 border-indigo-950 rounded-xl flex items-center justify-between">
            <span className="text-slate-500">Fluxo Menstrual:</span>
            <span className="text-indigo-950">{femaleLog.flow}</span>
          </div>
          <div className="p-3 bg-slate-50 border-2 border-indigo-950 rounded-xl space-y-1.5">
            <span className="text-slate-500 block">Sintomas Ativos hoje:</span>
            {femaleLog.symptoms.length === 0 ? (
              <p className="text-[11px] font-bold text-slate-400 italic">Nenhum sintoma selecionado hoje.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {femaleLog.symptoms.map((sym, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-rose-50 text-rose-700 border-2 border-rose-200"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
