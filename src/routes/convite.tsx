import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sparkles, ArrowRight, Heart, Trophy, Droplets, Pill } from "lucide-react";

export const ConviteRoute: React.FC = () => {
  const [, setLocation] = useLocation();
  const [apelido, setApelido] = useState("");
  const [entrou, setEntrou] = useState(false);

  // Pega o código de convite da URL se houver
  const params = new URLSearchParams(window.location.search);
  const codigoConvite = params.get("convite") || params.get("invite") || "herói";

  useEffect(() => {
    // Se já for usuário existente (tem dados no storage), redireciona direto
    const saved = localStorage.getItem("vita_hero_app_state_v1");
    if (saved) {
      setLocation("/");
    }
    // Marca que o acesso público está ativo
    localStorage.setItem("farmhero_public_access", "true");
    localStorage.setItem("farmhero_convite_codigo", codigoConvite);
  }, [codigoConvite, setLocation]);

  const handleEntrar = () => {
    if (apelido.trim()) {
      localStorage.setItem("farmhero_name", apelido.trim());
    }
    localStorage.setItem("farmhero_public_access", "true");
    setEntrou(true);
    setTimeout(() => setLocation("/"), 800);
  };

  if (entrou) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4 animate-in zoom-in duration-300">
          <div className="text-6xl animate-bounce">🚀</div>
          <p className="text-white text-xl font-black">Entrando no FarmHero...</p>
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo / Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 border-4 border-indigo-950 shadow-[0_8px_0px_#1e1b4b] mb-2">
            <span className="text-3xl">💊</span>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-black px-8 py-2.5 rounded-full border-4 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] uppercase tracking-wider inline-block">
            FARMHERO
          </div>
          <p className="text-slate-400 text-xs font-bold">Saúde Preventiva Gamificada 🎮</p>
        </div>

        {/* Cartão de boas-vindas */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl border-4 border-indigo-950 p-5 shadow-[4px_4px_0px_#1e1b4b] text-white space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <p className="text-xs font-black uppercase tracking-wider text-amber-300">
              Você foi convidado!
            </p>
          </div>
          <h1 className="text-lg font-black leading-snug">
            Bem-vindo ao FarmHero{codigoConvite !== "herói" ? `, código: ${codigoConvite}` : ""}! 🦸
          </h1>
          <p className="text-xs font-bold text-purple-200 leading-relaxed">
            Cuide da sua saúde de forma divertida. Registre hábitos, ganhe XP, suba de nível e
            compete no ranking!
          </p>
        </div>

        {/* Prévia das funcionalidades */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              icon: <Droplets className="w-4 h-4 text-cyan-400" />,
              label: "Hidratação",
              desc: "Registre a água",
              bg: "bg-cyan-950/50 border-cyan-800",
            },
            {
              icon: <Pill className="w-4 h-4 text-pink-400" />,
              label: "Medicamentos",
              desc: "Nunca esqueça",
              bg: "bg-pink-950/50 border-pink-800",
            },
            {
              icon: <Trophy className="w-4 h-4 text-amber-400" />,
              label: "Ranking",
              desc: "Compete e ganhe",
              bg: "bg-amber-950/50 border-amber-800",
            },
            {
              icon: <Heart className="w-4 h-4 text-rose-400" />,
              label: "Saúde Total",
              desc: "Pressão, humor...",
              bg: "bg-rose-950/50 border-rose-800",
            },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl border-2 p-3 space-y-1 ${item.bg}`}>
              <div className="flex items-center gap-1.5">
                {item.icon}
                <span className="text-[11px] font-black text-white">{item.label}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Campo de apelido (opcional) */}
        <div className="bg-slate-900 rounded-3xl border-2 border-slate-700 p-4 space-y-3">
          <div>
            <label className="text-xs font-black text-white block mb-1">
              Como quer ser chamado? <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEntrar()}
              placeholder="Ex: Herói da Saúde"
              maxLength={30}
              className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 px-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <button
            onClick={handleEntrar}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm rounded-2xl border-2 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] hover:shadow-[1px_1px_0px_#1e1b4b] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            Entrar no FarmHero
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <p className="text-center text-[10px] font-bold text-slate-500">
            Acesso público • Seus dados ficam no seu dispositivo
          </p>
        </div>
      </div>
    </div>
  );
};
