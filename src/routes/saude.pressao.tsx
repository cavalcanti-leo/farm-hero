import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAppState } from "@/lib/app-state";
import { 
  HeartPulse, 
  Plus, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { useTheme } from "@/lib/theme-context";

const TIPS = [
  "🧂 Reduza o consumo de sal: Evite alimentos industrializados e use temperos naturais como alho, cebola e ervas.",
  "🚴 Pratique exercícios: Pelo menos 150 minutos de atividade aeróbica moderada por semana ajudam a reduzir a pressão.",
  "🥗 Dieta Saudável: Adote a dieta DASH, rica em frutas, vegetais, grãos integrais e laticínios de baixo teor de gordura.",
  "💧 Hidrate-se bem: Beber água ajuda na regulação do fluxo sanguíneo e mantém a viscosidade do sangue adequada.",
  "🧘 Controle o estresse: Pratique técnicas de respiração, meditação ou hobbies relaxantes para diminuir o cortisol.",
  "🚬 Evite o cigarro e limite álcool: Substâncias tóxicas danificam as artérias e provocam picos repentinos na pressão.",
  "⚖️ Controle de peso: Manter o peso na faixa recomendada alivia a sobrecarga no sistema cardiovascular.",
  "😴 Sono de qualidade: Durma entre 7 e 8 horas por noite para que o organismo regule os hormônios da pressão."
];

export const SaudePressaoRoute: React.FC = () => {
  const { pressureLogs, addPressure } = useAppState();
  const { isDark, isLight, pageBgClass, cardBgClass, cardBorderClass, textPrimaryClass, textSecondaryClass } = useTheme();

  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(72);
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);

  // Rotate tips every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (systolic <= 0 || diastolic <= 0 || pulse <= 0) {
      toast.error("Por favor, preencha valores válidos maior que zero.");
      return;
    }
    addPressure({ systolic, diastolic, pulse });
    toast.success("✅ Pressão arterial registrada com sucesso!");
  };

  // Helper to categorize blood pressure status
  const getPressureStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { 
      label: "Ideal", 
      color: "bg-emerald-100 text-emerald-700 border-emerald-400",
      desc: "Excelente! Sua pressão está em uma ótima faixa saudável."
    };
    if (sys <= 129 && dia < 80) return { 
      label: "Elevada", 
      color: "bg-amber-100 text-amber-800 border-amber-400",
      desc: "Pressão levemente elevada. Atente-se aos hábitos diários."
    };
    if (sys <= 139 || dia <= 89) return { 
      label: "Hipertensão Estágio 1", 
      color: "bg-orange-100 text-orange-800 border-orange-400",
      desc: "Hipertensão leve. Recomenda-se orientação médica."
    };
    return { 
      label: "Hipertensão Estágio 2", 
      color: "bg-rose-100 text-rose-800 border-rose-400",
      desc: "Atenção: Pressão alta. Procure um profissional de saúde."
    };
  };

  // Map pressureLogs to Recharts format (ordered chronologically oldest to newest)
  const chartData = [...pressureLogs].reverse().map((log) => ({
    time: log.time,
    PAS: log.systolic,
    PAD: log.diastolic,
    BPM: log.pulse
  }));

  // Get the latest reading status to show description/banner
  const latestLog = pressureLogs[0];
  const latestStatus = latestLog ? getPressureStatus(latestLog.systolic, latestLog.diastolic) : null;

  return (
    <div className={`p-4 space-y-4 font-sans animate-in fade-in duration-200 ${pageBgClass}`}>
      {/* Barra Superior com o botão de voltar corrigido e estilizado */}
      <div className="flex items-center justify-between">
        <Link href="/saude" className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full border transition-all active:translate-y-0.5 ${
          isDark
            ? "bg-slate-800 border-slate-700 text-purple-400 hover:bg-slate-700"
            : "bg-white border-indigo-950 text-purple-700 shadow-[2px_2px_0px_#1e1b4b]"
        }`}>
          <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para Saúde
        </Link>
      </div>

      {/* Card Principal */}
      <div className={`rounded-3xl p-5 space-y-5 ${cardBgClass} ${cardBorderClass}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500 border-2 border-indigo-950/20 flex items-center justify-center text-white shrink-0">
            <HeartPulse className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className={`text-base font-black ${textPrimaryClass}`}>Pressão Arterial</h1>
            <p className={`text-xs font-bold ${textSecondaryClass}`}>Acompanhe e monitore sua saúde cardiovascular</p>
          </div>
        </div>

        {/* Gráfico de Linha de Tendência de Pressão */}
        <div className="space-y-2">
          <h3 className={`text-xs font-black uppercase tracking-wider ${textPrimaryClass}`}>Gráfico de Tendência (PAS / PAD):</h3>
          {chartData.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800 border-3 border-indigo-950/20 rounded-2xl p-6 text-center">
              <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className={`text-xs font-bold ${textSecondaryClass}`}>Nenhuma medição registrada para exibir no gráfico.</p>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 border-3 border-indigo-950/20 rounded-2xl p-3 h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -20, right: 8, top: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fontWeight: "bold", fill: "#475569" }} />
                  <YAxis domain={[40, 200]} tick={{ fontSize: 10, fontWeight: "bold", fill: "#475569" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "3px solid #1e1b4b", 
                      borderRadius: "12px",
                      fontFamily: "sans-serif",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "black" }} />
                  
                  {/* Linhas de Referência de Padrão Saudável */}
                  <ReferenceLine 
                    y={120} 
                    stroke="#10b981" 
                    strokeDasharray="4 4" 
                    strokeWidth={2}
                    label={{ value: "PAS Alvo (120)", position: "top", fill: "#059669", fontSize: 9, fontWeight: "bold" }} 
                  />
                  <ReferenceLine 
                    y={80} 
                    stroke="#06b6d4" 
                    strokeDasharray="4 4" 
                    strokeWidth={2}
                    label={{ value: "PAD Alvo (80)", position: "top", fill: "#0891b2", fontSize: 9, fontWeight: "bold" }} 
                  />

                  <Line type="monotone" dataKey="PAS" name="Sistólica (PAS)" stroke="#a855f7" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="PAD" name="Diastólica (PAD)" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bloco explicativo de Padrões Saudáveis */}
        <div className="bg-emerald-50 rounded-2xl border-3 border-indigo-950 p-4 space-y-2.5">
          <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
            💚 Padrão Saudável de Pressão
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white border-2 border-indigo-950 p-2.5 rounded-xl">
              <span className="font-black text-indigo-950 block">Sistólica (PAS)</span>
              <span className="text-[10px] font-bold text-slate-500 block mb-1">Pressão máxima nas artérias</span>
              <span className="text-emerald-700 font-extrabold text-sm">&lt; 120 mmHg</span>
            </div>
            <div className="bg-white border-2 border-indigo-950 p-2.5 rounded-xl">
              <span className="font-black text-indigo-950 block">Diastólica (PAD)</span>
              <span className="text-[10px] font-bold text-slate-500 block mb-1">Pressão mínima nas artérias</span>
              <span className="text-emerald-700 font-extrabold text-sm">&lt; 80 mmHg</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-500 text-center leading-relaxed">
            * Valores ideais ficam em torno de 120/80 mmHg. Valores entre 120/80 e 139/89 mmHg são considerados limítrofes. A partir de 140/90 mmHg indica-se hipertensão.
          </p>
        </div>

        {/* Banner de status da última leitura */}
        {latestLog && latestStatus && (
          <div className={`p-3 rounded-2xl border-2 border-indigo-950 flex items-start gap-2.5 text-xs font-bold shadow-[2px_2px_0px_#1e1b4b] ${latestStatus.color}`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-black">Último Registro: {latestLog.systolic}/{latestLog.diastolic} mmHg ({latestStatus.label})</p>
              <p className="font-bold text-[10px] mt-0.5 opacity-90">{latestStatus.desc}</p>
            </div>
          </div>
        )}

        {/* Formulário de Registro de Pressão (Neo-brutalista) */}
        <form onSubmit={handleSubmit} className="bg-slate-50 border-3 border-indigo-950 p-4 rounded-2xl space-y-4">
          <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 stroke-[3] text-purple-600" /> Registrar Pressão
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-black text-slate-600 mb-1 block">Sistólica (PAS)</label>
              <Input
                type="number"
                min="60"
                max="240"
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="bg-white border-3 border-indigo-950 rounded-xl text-xs font-black text-indigo-950 placeholder:text-slate-400"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-600 mb-1 block">Diastólica (PAD)</label>
              <Input
                type="number"
                min="40"
                max="140"
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                className="bg-white border-3 border-indigo-950 rounded-xl text-xs font-black text-indigo-950 placeholder:text-slate-400"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-600 mb-1 block">Pulsação (BPM)</label>
              <Input
                type="number"
                min="40"
                max="200"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className="bg-white border-3 border-indigo-950 rounded-xl text-xs font-black text-indigo-950 placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full border-3 border-indigo-950 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs py-2.5 shadow-[2px_2px_0px_#1e1b4b] active:translate-y-0.5 transition-all">
            <ShieldCheck className="w-4 h-4 mr-1.5" /> Salvar Pressão (+25 XP)
          </Button>
        </form>

        {/* Carrossel de Dicas de Saúde (Muda a cada 8 segundos) */}
        <div className="bg-indigo-50 border-3 border-indigo-950 rounded-2xl p-4 space-y-2 relative overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-indigo-950 uppercase tracking-widest flex items-center gap-1">
              💡 DICA DE SAÚDE
            </span>
            <span className="text-[9px] font-black text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-md">
              Muda a cada 8s
            </span>
          </div>
          
          <div className="h-12 flex items-center justify-center">
            <p className="text-xs font-extrabold text-indigo-950 text-center animate-in fade-in duration-500" key={currentTipIndex}>
              {TIPS[currentTipIndex]}
            </p>
          </div>

          {/* Dots de Indicação de Progresso */}
          <div className="flex justify-center gap-1.5 pt-1">
            {TIPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentTipIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentTipIndex === idx 
                    ? "bg-indigo-700 w-3" 
                    : "bg-indigo-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Histórico do Dia */}
      <div className="bg-white border-4 border-indigo-950 rounded-3xl p-4 shadow-[4px_4px_0px_#1e1b4b] space-y-3">
        <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Histórico de Medições</h3>
        {pressureLogs.length === 0 ? (
          <p className="text-xs text-slate-400 font-bold">Nenhum registro de pressão ainda.</p>
        ) : (
          <div className="space-y-2">
            {pressureLogs.map((log) => {
              const status = getPressureStatus(log.systolic, log.diastolic);
              return (
                <div key={log.id} className="flex items-center justify-between p-3.5 bg-slate-50 border-2 border-indigo-950 rounded-2xl text-xs font-black shadow-[2px_2px_0px_#1e1b4b]">
                  <div>
                    <p className="text-sm font-black text-indigo-950">
                      {log.systolic} / {log.diastolic} <span className="text-[10px] text-slate-500 font-bold">mmHg</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                      Pulso: {log.pulse} BPM • {log.time}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border-2 border-indigo-950 shadow-[1px_1px_0px_#1e1b4b] ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
