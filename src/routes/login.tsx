import React from "react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth, formatCPF, validateCPF } from "@/lib/auth-context";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CreditCard,
  User,
  Code2,
} from "lucide-react";
import { toast } from "sonner";

type LoginMode = "cpf" | "email";
type LoginStep = "role" | "form";

export const LoginRoute: React.FC = () => {
  const [, setLocation] = useLocation();
  const { login, loginByCpf, loginWithGoogle, registerDev } = useAuth();

  const [step, setStep] = useState<LoginStep>("role");
  const [role, setRole] = useState<"farmaceutico" | "cliente">("cliente");
  const [mode, setMode] = useState<LoginMode>("cpf");

  // CPF login
  const [cpfInput, setCpfInput] = useState("");
  const [nomeInput, setNomeInput] = useState("");

  // Email login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);

  // Google modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleNome, setGoogleNome] = useState("");
  const [googleSobrenome, setGoogleSobrenome] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleCpf, setGoogleCpf] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // DEV modal
  const [showDevModal, setShowDevModal] = useState(false);
  const [devCpf, setDevCpf] = useState("");
  const [devLoading, setDevLoading] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleCpfLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpfInput || !nomeInput.trim()) {
      toast.error("Preencha CPF e nome de usuário.");
      return;
    }
    if (!validateCPF(cpfInput)) {
      toast.error("CPF inválido. Verifique os dígitos.");
      return;
    }
    setLoading(true);
    const ok = await loginByCpf(cpfInput, nomeInput);
    setLoading(false);
    if (ok) setLocation("/");
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) setLocation("/");
  };

  const handleGoogleConfirm = async () => {
    if (!googleNome || !googleEmail || !googleCpf) {
      toast.error("Preencha nome, e-mail e CPF.");
      return;
    }
    setGoogleLoading(true);
    const ok = await loginWithGoogle(role, {
      nome: googleNome,
      sobrenome: googleSobrenome,
      email: googleEmail,
      cpf: googleCpf,
    });
    setGoogleLoading(false);
    if (ok) {
      setShowGoogleModal(false);
      setLocation("/");
    }
  };

  const handleDevAccess = async () => {
    if (!devCpf) {
      toast.error("Informe seu CPF.");
      return;
    }
    setDevLoading(true);
    const result = await registerDev(devCpf);
    setDevLoading(false);
    if (result.success) {
      setShowDevModal(false);
      setLocation("/");
    } else toast.error(result.error || "Erro no acesso DEV.");
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
      {/* BG decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-700/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-700/25 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-400">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border-4 border-indigo-950 shadow-[0_6px_0px_#1e1b4b]">
            <span className="text-2xl">💊</span>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-black px-7 py-2 rounded-full border-4 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] uppercase tracking-wider inline-block">
            FARMHERO
          </div>
          <p className="text-slate-400 text-xs font-bold">Sua saúde, gamificada 🎮</p>
        </div>

        {/* ── Step 1: selecionar papel ── */}
        {step === "role" && (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-white text-xl font-black">Quem é você?</h1>
              <p className="text-slate-400 text-xs font-bold mt-1">Escolha seu tipo de acesso</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole("farmaceutico")}
                className={`rounded-3xl border-4 p-4 flex flex-col items-center gap-2 transition-all active:scale-95 ${
                  role === "farmaceutico"
                    ? "bg-purple-600 border-indigo-950 shadow-[4px_4px_0px_#1e1b4b] text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-purple-700"
                }`}
              >
                <span className="text-3xl">🧑‍⚕️</span>
                <div className="text-center">
                  <p className="text-xs font-black">Farmacêutico</p>
                  <p className="text-[10px] font-bold opacity-70 mt-0.5">Profissional de saúde</p>
                </div>
                {role === "farmaceutico" && (
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                )}
              </button>

              <button
                onClick={() => setRole("cliente")}
                className={`rounded-3xl border-4 p-4 flex flex-col items-center gap-2 transition-all active:scale-95 ${
                  role === "cliente"
                    ? "bg-indigo-600 border-indigo-950 shadow-[4px_4px_0px_#1e1b4b] text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-700"
                }`}
              >
                <span className="text-3xl">🦸</span>
                <div className="text-center">
                  <p className="text-xs font-black">Cliente / Paciente</p>
                  <p className="text-[10px] font-bold opacity-70 mt-0.5">Usuário da plataforma</p>
                </div>
                {role === "cliente" && (
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setStep("form")}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm rounded-2xl border-4 border-indigo-950 shadow-[4px_4px_0px_#1e1b4b] hover:shadow-[2px_2px_0px_#1e1b4b] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              Continuar <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Botão DEV */}
            <button
              onClick={() => setShowDevModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 border border-slate-700 rounded-2xl text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all text-xs font-black"
            >
              <Code2 className="w-3.5 h-3.5" /> Acesso DEV
            </button>
          </div>
        )}

        {/* ── Step 2: formulário de login ── */}
        {step === "form" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("role")}
                className="text-xs font-black text-purple-400 hover:text-purple-300"
              >
                ← Voltar
              </button>
              <span
                className={`text-[10px] font-black px-3 py-1 rounded-full border-2 border-indigo-950 ${
                  role === "farmaceutico" ? "bg-purple-600 text-white" : "bg-indigo-600 text-white"
                }`}
              >
                {role === "farmaceutico" ? "🧑‍⚕️ Farmacêutico" : "🦸 Cliente"}
              </span>
            </div>

            {/* Seletor de modo */}
            <div className="flex rounded-2xl bg-slate-800 border-2 border-slate-700 p-1 gap-1">
              <button
                onClick={() => setMode("cpf")}
                className={`flex-1 py-2 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  mode === "cpf"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> CPF + Nome
              </button>
              <button
                onClick={() => setMode("email")}
                className={`flex-1 py-2 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  mode === "email"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> E-mail
              </button>
            </div>

            <div className="bg-slate-900 rounded-3xl border-2 border-slate-700 p-5 space-y-4">
              <h2 className="text-white text-base font-black">Entrar na sua conta</h2>

              {/* ── Login por CPF + nome ── */}
              {mode === "cpf" && (
                <form onSubmit={handleCpfLogin} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">CPF</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={cpfInput}
                        onChange={(e) => setCpfInput(formatCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 pl-9 pr-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">
                      Nome de usuário
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={nomeInput}
                        onChange={(e) => setNomeInput(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 pl-9 pr-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500">
                      Novo usuário? Basta preencher e entrar — conta criada automaticamente!
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm rounded-2xl border-2 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] hover:shadow-[1px_1px_0px_#1e1b4b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
                  </button>
                </form>
              )}

              {/* ── Login por e-mail ── */}
              {mode === "email" && (
                <form onSubmit={handleEmailLogin} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">E-mail ou CPF</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com ou CPF"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 pl-9 pr-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 pl-9 pr-10 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm rounded-2xl border-2 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] hover:shadow-[1px_1px_0px_#1e1b4b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
                  </button>
                </form>
              )}

              {/* Divisor */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-[10px] font-black text-slate-500">OU</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Google */}
              <button
                onClick={() => setShowGoogleModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white rounded-2xl border-2 border-slate-300 font-black text-sm text-slate-800 hover:bg-slate-50 shadow-sm transition-all active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </button>
            </div>

            <p className="text-center text-xs font-bold text-slate-400">
              Não tem conta?{" "}
              <button
                onClick={() => setLocation(`/cadastro?role=${role}`)}
                className="text-purple-400 font-black hover:text-purple-300 underline underline-offset-2"
              >
                Criar conta
              </button>
            </p>
          </div>
        )}
      </div>

      {/* ── Modal Google ── */}
      {showGoogleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={(e) => e.target === e.currentTarget && setShowGoogleModal(false)}
        >
          <div className="w-full max-w-xs bg-white rounded-3xl border-4 border-indigo-950 shadow-[6px_6px_0px_#1e1b4b] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-white px-5 pt-5 pb-3 flex items-center gap-3 border-b border-slate-100">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div>
                <p className="text-xs font-black text-slate-800">Entrar com o Google</p>
                <p className="text-[10px] font-bold text-slate-500">Confirme seus dados</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black text-slate-600 block mb-0.5">Nome</label>
                  <input
                    type="text"
                    value={googleNome}
                    onChange={(e) => setGoogleNome(e.target.value)}
                    placeholder="Nome"
                    className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-600 block mb-0.5">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    value={googleSobrenome}
                    onChange={(e) => setGoogleSobrenome(e.target.value)}
                    placeholder="Sobrenome"
                    className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-600 block mb-0.5">
                  E-mail Google
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="seu@gmail.com"
                  className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-600 block mb-0.5">CPF</label>
                <input
                  type="text"
                  value={googleCpf}
                  onChange={(e) => setGoogleCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-400"
                />
              </div>
              <button
                onClick={handleGoogleConfirm}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4285F4] text-white font-black text-xs rounded-xl border-2 border-slate-200 shadow transition-all disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Entrar com esta conta"
                )}
              </button>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="w-full py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal DEV ── */}
      {showDevModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={(e) => e.target === e.currentTarget && setShowDevModal(false)}
        >
          <div className="w-full max-w-xs bg-slate-900 rounded-3xl border-4 border-slate-600 shadow-[6px_6px_0px_#0f172a] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center gap-3 border-b border-slate-600">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 border-2 border-slate-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-black text-white flex items-center gap-1.5">
                  Acesso DEV{" "}
                  <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full font-black">
                    ⚙️ DEV
                  </span>
                </p>
                <p className="text-[10px] font-bold text-slate-400">Somente para desenvolvedores</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3 space-y-1">
                <p className="text-xs font-black text-emerald-400">Como funciona?</p>
                <p className="text-[11px] font-bold text-slate-400 leading-snug">
                  Na primeira vez: informe seu CPF para criar sua conta DEV.
                  <br />
                  Nas próximas vezes: o mesmo CPF faz login automaticamente.
                  <br />
                  Você ganhará o símbolo <span className="text-emerald-300 font-black">
                    ⚙️ DEV
                  </span>{" "}
                  no perfil.
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300 block">Seu CPF</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={devCpf}
                    onChange={(e) => setDevCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 pl-9 pr-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={handleDevAccess}
                disabled={devLoading || devCpf.replace(/\D/g, "").length < 11}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl border-2 border-emerald-950 shadow-[3px_3px_0px_#052e16] hover:shadow-[1px_1px_0px_#052e16] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {devLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Code2 className="w-4 h-4" /> Entrar como DEV
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDevModal(false)}
                className="w-full py-2 text-[11px] font-bold text-slate-500 hover:text-slate-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
