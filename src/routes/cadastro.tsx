import React from "react";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  useAuth,
  validatePassword,
  validateCPF,
  formatCPF,
  RegisterData,
} from "@/lib/auth-context";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CreditCard,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Building,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  FileText,
  Sparkles,
} from "lucide-react";

type Role = "farmaceutico" | "cliente";

// ─── Password Strength Indicator ─────────────────────────────────────────────
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const hasLength = password.length >= 8;
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (!password) return null;
  return (
    <div className="space-y-1 mt-1.5">
      <div
        className={`flex items-center gap-1.5 text-[10px] font-bold ${hasLength ? "text-emerald-500" : "text-rose-400"}`}
      >
        {hasLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
        Mínimo 8 caracteres ({password.length}/8)
      </div>
      <div
        className={`flex items-center gap-1.5 text-[10px] font-bold ${hasSpecial ? "text-emerald-500" : "text-rose-400"}`}
      >
        {hasSpecial ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        Pelo menos 1 caractere especial (!@#$%^&*)
      </div>
      <div className="flex gap-1 mt-1">
        {[0, 1, 2, 3].map((i) => {
          const filled = [
            password.length > 0,
            password.length >= 5,
            hasLength,
            hasLength && hasSpecial,
          ][i];
          const colors = ["bg-rose-500", "bg-amber-400", "bg-yellow-400", "bg-emerald-500"];
          return (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${filled ? colors[i] : "bg-slate-700"}`}
            />
          );
        })}
      </div>
      <p className="text-[9px] font-bold text-slate-500">
        {!hasLength
          ? "Senha fraca"
          : !hasSpecial
            ? "Adicione um símbolo especial"
            : "Senha forte ✅"}
      </p>
    </div>
  );
};

// ─── CPF Field ────────────────────────────────────────────────────────────────
const CPFField: React.FC<{ value: string; onChange: (v: string) => void; error?: string }> = ({
  value,
  onChange,
  error,
}) => {
  const isValid = value.replace(/\D/g, "").length === 11 && validateCPF(value);
  const hasInput = value.length > 0;
  return (
    <div className="space-y-1">
      <label className="text-xs font-black text-slate-300 block">CPF</label>
      <div className="relative">
        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(formatCPF(e.target.value))}
          placeholder="000.000.000-00"
          maxLength={14}
          className={`w-full rounded-xl border-2 bg-slate-800 pl-9 pr-9 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
            error
              ? "border-rose-500"
              : hasInput && isValid
                ? "border-emerald-500"
                : hasInput
                  ? "border-amber-500"
                  : "border-slate-600 focus:border-purple-500"
          }`}
        />
        {hasInput && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>
        )}
      </div>
      {error && <p className="text-[10px] font-bold text-rose-400">{error}</p>}
      {hasInput && !isValid && !error && (
        <p className="text-[10px] font-bold text-amber-400">CPF inválido — verifique os dígitos</p>
      )}
      {isValid && <p className="text-[10px] font-bold text-emerald-400">✅ CPF válido</p>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const CadastroRoute: React.FC = () => {
  const [, setLocation] = useLocation();
  const { register, loginWithGoogle } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const initialRole = (params.get("role") as Role) || "cliente";
  const [role, setRole] = useState<Role>(initialRole);

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Campos específicos de Paciente
  const [birthDate, setBirthDate] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");

  // Campos específicos de Farmacêutico
  const [crfNumber, setCrfNumber] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyCnpj, setPharmacyCnpj] = useState("");
  const [branch, setBranch] = useState("");
  const [pharmacyPhone, setPharmacyPhone] = useState("");
  const [specialty, setSpecialty] = useState("Atenção Farmacêutica & Exames");

  // Google modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleNome, setGoogleNome] = useState("");
  const [googleSobrenome, setGoogleSobrenome] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleCpf, setGoogleCpf] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!nome.trim()) newErrors.nome = "Nome obrigatório";
    if (!sobrenome.trim()) newErrors.sobrenome = "Sobrenome obrigatório";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "E-mail inválido";
    if (!cpf.trim()) newErrors.cpf = "CPF obrigatório";
    else if (!validateCPF(cpf)) newErrors.cpf = "CPF inválido";
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) newErrors.password = pwCheck.errors.join(" • ");
    if (password !== confirmPw) newErrors.confirmPw = "As senhas não coincidem";

    // Validações específicas por papel
    if (role === "cliente") {
      if (!birthDate) newErrors.birthDate = "Data de nascimento obrigatória";
      if (!city.trim()) newErrors.city = "Cidade onde mora obrigatória";
    } else if (role === "farmaceutico") {
      if (!crfNumber.trim()) newErrors.crfNumber = "Número de CRF obrigatório";
      if (!pharmacyName.trim()) newErrors.pharmacyName = "Nome da farmácia obrigatório";
      if (!branch.trim()) newErrors.branch = "Filial da farmácia obrigatória";
      if (!pharmacyCnpj.trim()) newErrors.pharmacyCnpj = "CNPJ da farmácia obrigatório";
      if (!city.trim()) newErrors.city = "Cidade da farmácia obrigatória";
      if (!state.trim()) newErrors.state = "Estado (UF) obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const data: RegisterData = {
      nome: nome.trim(),
      sobrenome: sobrenome.trim(),
      email: email.trim().toLowerCase(),
      cpf,
      password,
      role,
      birthDate: birthDate || undefined,
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      address: address.trim() || undefined,
      crfNumber: crfNumber.trim() || undefined,
      pharmacyName: pharmacyName.trim() || undefined,
      pharmacyCnpj: pharmacyCnpj.trim() || undefined,
      branch: branch.trim() || undefined,
      pharmacyPhone: pharmacyPhone.trim() || undefined,
      specialty: specialty.trim() || undefined,
    };
    const result = await register(data);
    setLoading(false);
    if (result.success) setLocation("/");
    else if (result.error) setErrors({ general: result.error });
  };

  const handleGoogleRegister = async () => {
    if (!googleNome || !googleEmail || !googleCpf) return;
    if (!validateCPF(googleCpf)) {
      setErrors({ googleCpf: "CPF inválido" });
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

  const inputCls = (field: string) =>
    `w-full rounded-xl border-2 bg-slate-800 px-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
      errors[field] ? "border-rose-500" : "border-slate-600 focus:border-purple-500"
    }`;

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-700/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-5 py-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border-4 border-indigo-950 shadow-[0_5px_0px_#1e1b4b]">
            <span className="text-2xl">💊</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-black">Criar conta</h1>
            <p className="text-slate-400 text-xs font-bold mt-1">Junte-se ao FarmHero</p>
          </div>
        </div>

        {/* Seletor de papel */}
        <div className="flex rounded-2xl bg-slate-800 border-2 border-slate-700 p-1 gap-1">
          {(["cliente", "farmaceutico"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                role === r
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {r === "cliente" ? "🦸 Paciente" : "🧑‍⚕️ Farmacêutico"}
            </button>
          ))}
        </div>

        {/* Formulário */}
        <div className="bg-slate-900 rounded-3xl border-2 border-slate-700 p-5 space-y-4">
          {errors.general && (
            <div className="bg-rose-950 border-2 border-rose-700 rounded-xl p-3 text-xs font-bold text-rose-300">
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300 block">Nome</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="José"
                    className={`w-full rounded-xl border-2 bg-slate-800 pl-8 pr-2.5 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.nome ? "border-rose-500" : "border-slate-600 focus:border-purple-500"
                    }`}
                  />
                  {errors.nome && (
                    <p className="text-[10px] font-bold text-rose-400 mt-0.5">{errors.nome}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-300 block">Sobrenome</label>
                <input
                  type="text"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  placeholder="Cavalcanti"
                  className={inputCls("sobrenome")}
                />
                {errors.sobrenome && (
                  <p className="text-[10px] font-bold text-rose-400">{errors.sobrenome}</p>
                )}
              </div>
            </div>

            {/* CPF — obrigatório para todos */}
            <CPFField value={cpf} onChange={setCpf} error={errors.cpf} />

            {/* E-mail */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={`w-full rounded-xl border-2 bg-slate-800 pl-9 pr-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.email ? "border-rose-500" : "border-slate-600 focus:border-purple-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-bold text-rose-400">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mín. 8 chars + símbolo"
                  className={`w-full rounded-xl border-2 bg-slate-800 pl-9 pr-10 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.password ? "border-rose-500" : "border-slate-600 focus:border-purple-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-rose-400">{errors.password}</p>
              )}
              <PasswordStrength password={password} />
            </div>

            {/* Confirmar senha */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300 block">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repita a senha"
                  className={`w-full rounded-xl border-2 bg-slate-800 pl-9 pr-10 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.confirmPw
                      ? "border-rose-500"
                      : confirmPw && confirmPw === password
                        ? "border-emerald-500"
                        : "border-slate-600 focus:border-purple-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPw && (
                <p className="text-[10px] font-bold text-rose-400">{errors.confirmPw}</p>
              )}
              {confirmPw && confirmPw === password && !errors.confirmPw && (
                <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Senhas coincidem
                </p>
              )}
            </div>

            {/* ─── Campos Específicos para Paciente ─────────────────────── */}
            {role === "cliente" && (
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-purple-400">
                  <Calendar className="w-4 h-4" />
                  <span>Informações do Paciente</span>
                </div>

                {/* Data de Aniversário */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-300 block">
                    Data de Nascimento / Aniversário
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className={`w-full rounded-xl border-2 bg-slate-800 pl-9 pr-3 py-2 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.birthDate ? "border-rose-500" : "border-slate-600 focus:border-purple-500"
                      }`}
                    />
                  </div>
                  {errors.birthDate && (
                    <p className="text-[10px] font-bold text-rose-400">{errors.birthDate}</p>
                  )}
                </div>

                {/* Onde mora: Cidade e Estado */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Cidade onde mora</label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: São Paulo"
                        className={`w-full rounded-xl border-2 bg-slate-800 pl-8 pr-2.5 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.city ? "border-rose-500" : "border-slate-600 focus:border-purple-500"
                        }`}
                      />
                    </div>
                    {errors.city && (
                      <p className="text-[10px] font-bold text-rose-400">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Estado</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      placeholder="SP"
                      className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 px-3 py-2.5 text-sm font-bold text-white uppercase placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Endereço simples (opcional) */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-300 block">Endereço / Bairro (Opcional)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Bairro, Rua ou Região"
                    className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 px-3 py-2 text-sm font-bold text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* ─── Campos Específicos para Farmacêutico ───────────────── */}
            {role === "farmaceutico" && (
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dados Profissionais & da Farmácia</span>
                </div>

                {/* CRF e Especialidade */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Registro CRF</label>
                    <div className="relative">
                      <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={crfNumber}
                        onChange={(e) => setCrfNumber(e.target.value)}
                        placeholder="CRF/SP 123456"
                        className={`w-full rounded-xl border-2 bg-slate-800 pl-8 pr-2 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.crfNumber ? "border-rose-500" : "border-slate-600 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {errors.crfNumber && (
                      <p className="text-[10px] font-bold text-rose-400">{errors.crfNumber}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Especialidade</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Ex: Atenção Farmacêutica"
                      className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 px-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Nome da Farmácia e Filial */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-300 block">Nome da Farmácia / Drogaria</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      placeholder="Ex: Drogaria Saúde Total"
                      className={`w-full rounded-xl border-2 bg-slate-800 pl-9 pr-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.pharmacyName ? "border-rose-500" : "border-slate-600 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.pharmacyName && (
                    <p className="text-[10px] font-bold text-rose-400">{errors.pharmacyName}</p>
                  )}
                </div>

                {/* Filial / Unidade e CNPJ */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Filial / Unidade</label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="Ex: Filial 02 - Centro"
                      className={`w-full rounded-xl border-2 bg-slate-800 px-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.branch ? "border-rose-500" : "border-slate-600 focus:border-emerald-500"
                      }`}
                    />
                    {errors.branch && (
                      <p className="text-[10px] font-bold text-rose-400">{errors.branch}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">CNPJ da Farmácia</label>
                    <input
                      type="text"
                      value={pharmacyCnpj}
                      onChange={(e) => setPharmacyCnpj(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      className={`w-full rounded-xl border-2 bg-slate-800 px-3 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.pharmacyCnpj ? "border-rose-500" : "border-slate-600 focus:border-emerald-500"
                      }`}
                    />
                    {errors.pharmacyCnpj && (
                      <p className="text-[10px] font-bold text-rose-400">{errors.pharmacyCnpj}</p>
                    )}
                  </div>
                </div>

                {/* Cidade e Estado da Farmácia */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Cidade da Farmácia</label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: São Paulo"
                        className={`w-full rounded-xl border-2 bg-slate-800 pl-8 pr-2.5 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.city ? "border-rose-500" : "border-slate-600 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {errors.city && (
                      <p className="text-[10px] font-bold text-rose-400">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">UF</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      placeholder="SP"
                      className={`w-full rounded-xl border-2 bg-slate-800 px-3 py-2.5 text-sm font-bold text-white uppercase placeholder-slate-500 focus:outline-none transition-colors ${
                        errors.state ? "border-rose-500" : "border-slate-600 focus:border-emerald-500"
                      }`}
                    />
                    {errors.state && (
                      <p className="text-[10px] font-bold text-rose-400">{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* Endereço e Telefone da Farmácia */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Endereço da Farmácia</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, Número, Bairro"
                      className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 px-3 py-2 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-300 block">Telefone / Contato</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={pharmacyPhone}
                        onChange={(e) => setPharmacyPhone(e.target.value)}
                        placeholder="(11) 98765-4321"
                        className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 pl-8 pr-2.5 py-2 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm rounded-2xl border-2 border-indigo-950 shadow-[3px_3px_0px_#1e1b4b] hover:shadow-[1px_1px_0px_#1e1b4b] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {" "}
                  Criar Conta <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-[10px] font-black text-slate-500">OU</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <button
            type="button"
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
            Cadastrar com Google
          </button>
        </div>

        <p className="text-center text-xs font-bold text-slate-400">
          Já tem conta?{" "}
          <button
            onClick={() => setLocation("/login")}
            className="text-purple-400 font-black hover:text-purple-300 underline underline-offset-2"
          >
            Fazer login
          </button>
        </p>
      </div>

      {/* ── Modal Google ── */}
      {showGoogleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
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
                <p className="text-xs font-black text-slate-800">Cadastrar com Google</p>
                <p className="text-[10px] font-bold text-slate-500">
                  {role === "farmaceutico" ? "🧑‍⚕️ Farmacêutico" : "🦸 Cliente"}
                </p>
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
                  className={`w-full rounded-lg border-2 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-400 ${errors.googleCpf ? "border-rose-400" : "border-slate-200"}`}
                />
                {errors.googleCpf && (
                  <p className="text-[10px] font-bold text-rose-500">{errors.googleCpf}</p>
                )}
              </div>
              <button
                onClick={handleGoogleRegister}
                disabled={googleLoading || !googleNome || !googleEmail || !googleCpf}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4285F4] text-white font-black text-xs rounded-xl border-2 border-slate-200 shadow transition-all disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Criar conta com Google"
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
    </div>
  );
};
