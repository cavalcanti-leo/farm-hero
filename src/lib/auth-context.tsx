import React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { upsertUser, getAllUsers, findUserByCpf, findUserByEmail, type DbUser } from "./database";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "farmaceutico" | "cliente" | "dev";
export type AuthProvider = "local" | "google" | "cpf";

export interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email?: string;
  cpf: string;
  role: UserRole;
  provider: AuthProvider;
  avatarUrl?: string;
  isDev?: boolean;
  createdAt: string;
  birthDate?: string;
  city?: string;
  state?: string;
  address?: string;
  crfNumber?: string;
  pharmacyName?: string;
  pharmacyCnpj?: string;
  branch?: string;
  pharmacyPhone?: string;
  specialty?: string;
  stars?: number;
  ratingCount?: number;
  patientsServed?: number;
}

export interface RegisterData {
  nome: string;
  sobrenome: string;
  email?: string;
  cpf: string;
  password: string;
  role: UserRole;
  provider?: AuthProvider;
  avatarUrl?: string;
  isDev?: boolean;
  birthDate?: string;
  city?: string;
  state?: string;
  address?: string;
  crfNumber?: string;
  pharmacyName?: string;
  pharmacyCnpj?: string;
  branch?: string;
  pharmacyPhone?: string;
  specialty?: string;
}

interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  login: (emailOrCpf: string, password: string) => Promise<boolean>;
  loginByCpf: (cpf: string, nome: string) => Promise<boolean>;
  loginWithGoogle: (role: UserRole, mockData?: Partial<User>) => Promise<boolean>;
  registerDev: (cpf: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAllUsers: () => Promise<User[]>;
  refreshUser: () => Promise<void>;
  switchDevRole: (newRole: "farmaceutico" | "cliente") => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SESSION_KEY = "farmhero_current_user_v2";

function hashPassword(pw: string): string {
  let h = 0;
  for (let i = 0; i < pw.length; i++) {
    h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
  }
  return `fh_${Math.abs(h).toString(36)}_${pw.length}`;
}

export function validatePassword(pw: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (pw.length < 8) errors.push("Mínimo de 8 caracteres");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw))
    errors.push("Pelo menos 1 caractere especial (!@#$%^&* etc.)");
  return { valid: errors.length === 0, errors };
}

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(digits[10]);
}

export function formatCPF(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

// Converte DbUser → User (público, sem hash)
function toPublicUser(db: DbUser): User {
  return {
    id: db.id,
    nome: db.nome,
    sobrenome: db.sobrenome,
    email: db.email,
    cpf: db.cpf,
    role: db.role as UserRole,
    provider: db.provider as AuthProvider,
    avatarUrl: db.avatar_url,
    isDev: db.is_dev,
    createdAt: db.created_at || new Date().toISOString(),
    birthDate: db.birth_date,
    city: db.city,
    state: db.state,
    address: db.address,
    crfNumber: db.crf_number,
    pharmacyName: db.pharmacy_name,
    pharmacyCnpj: db.pharmacy_cnpj,
    branch: db.branch,
    pharmacyPhone: db.pharmacy_phone,
    specialty: db.specialty,
    stars: db.stars ?? 0,
    ratingCount: db.rating_count ?? 0,
    patientsServed: db.patients_served ?? 0,
  };
}

const GOOGLE_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
];

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão salva
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) setCurrentUser(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    setIsLoading(false);
  }, []);

  const persistSession = useCallback((user: User | null) => {
    setCurrentUser(user);
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, []);

  // ── Login por e-mail ou CPF + senha ────────────────────────────────────────
  const login = useCallback(
    async (emailOrCpf: string, password: string): Promise<boolean> => {
      const inputClean = emailOrCpf.replace(/\D/g, "");
      const isCpfInput = inputClean.length === 11;

      let found: DbUser | null = null;
      if (isCpfInput) {
        found = await findUserByCpf(emailOrCpf);
      } else {
        found = await findUserByEmail(emailOrCpf);
      }

      if (!found) {
        toast.error("Usuário não encontrado. Verifique e-mail/CPF ou crie uma conta.");
        return false;
      }
      if (found.provider !== "local") {
        toast.error("Esta conta usa login por CPF ou Google. Tente o método correto.");
        return false;
      }
      if (found.password_hash !== hashPassword(password)) {
        toast.error("Senha incorreta. Tente novamente.");
        return false;
      }

      const pub = toPublicUser(found);
      persistSession(pub);
      toast.success(`Bem-vindo de volta, ${pub.nome}! ${pub.isDev ? "⚙️" : "🦸"}`);
      return true;
    },
    [persistSession],
  );

  // ── Login por CPF + nome (sem senha) ──────────────────────────────────────
  const loginByCpf = useCallback(
    async (cpf: string, nome: string): Promise<boolean> => {
      if (!validateCPF(cpf)) {
        toast.error("CPF inválido. Verifique os dígitos.");
        return false;
      }

      const found = await findUserByCpf(cpf);

      if (found && found.provider === "cpf") {
        const pub = toPublicUser(found);
        persistSession(pub);
        toast.success(`Bem-vindo de volta, ${pub.nome}! 👋`);
        return true;
      }

      // Criar nova conta CPF
      const [firstName, ...rest] = nome.trim().split(" ");
      const newUser: DbUser = {
        id: `cpf_${Date.now()}`,
        nome: firstName || nome,
        sobrenome: rest.join(" ") || "",
        cpf: formatCPF(cpf),
        role: "cliente",
        provider: "cpf",
        is_dev: false,
        password_hash: "",
        created_at: new Date().toISOString(),
      };

      await upsertUser(newUser);
      const pub = toPublicUser(newUser);
      persistSession(pub);
      toast.success(`Bem-vindo ao FarmHero, ${firstName}! 🎉`);
      return true;
    },
    [persistSession],
  );

  // ── Login com Google (mock) ────────────────────────────────────────────────
  const loginWithGoogle = useCallback(
    async (role: UserRole, mockData?: Partial<User>): Promise<boolean> => {
      if (!mockData?.cpf && !mockData?.email) return false;

      if (mockData.cpf && !validateCPF(mockData.cpf)) {
        toast.error("CPF inválido.");
        return false;
      }

      // Verifica se já existe
      let existing: DbUser | null = null;
      if (mockData.cpf) existing = await findUserByCpf(mockData.cpf);
      if (!existing && mockData.email) existing = await findUserByEmail(mockData.email);

      if (existing) {
        const pub = toPublicUser(existing);
        persistSession(pub);
        toast.success(`Bem-vindo de volta, ${pub.nome}! 🦸`);
        return true;
      }

      const newUser: DbUser = {
        id: `google_${Date.now()}`,
        nome: mockData.nome || "Usuário",
        sobrenome: mockData.sobrenome || "",
        email: mockData.email,
        cpf: mockData.cpf ? formatCPF(mockData.cpf) : "",
        role,
        provider: "google",
        avatar_url:
          mockData.avatarUrl || GOOGLE_AVATARS[Math.floor(Math.random() * GOOGLE_AVATARS.length)],
        is_dev: false,
        password_hash: "",
        created_at: new Date().toISOString(),
      };

      await upsertUser(newUser);
      const pub = toPublicUser(newUser);
      persistSession(pub);
      toast.success(`Conta Google criada! Bem-vindo, ${pub.nome}! 🎉`);
      return true;
    },
    [persistSession],
  );

  // ── Registro DEV ──────────────────────────────────────────────────────────
  const registerDev = useCallback(
    async (cpf: string): Promise<{ success: boolean; error?: string }> => {
      if (!validateCPF(cpf))
        return { success: false, error: "CPF inválido. Verifique os dígitos." };

      // Se já existe DEV com este CPF → apenas loga
      const existing = await findUserByCpf(cpf);
      if (existing && existing.is_dev) {
        const pub = toPublicUser(existing);
        persistSession(pub);
        toast.success(`⚙️ Bem-vindo de volta, DEV ${pub.nome}!`);
        return { success: true };
      }

      const newDev: DbUser = {
        id: `dev_${Date.now()}`,
        nome: "Dev",
        sobrenome: "FarmHero",
        cpf: formatCPF(cpf),
        role: "dev",
        provider: "local",
        is_dev: true,
        password_hash: hashPassword(cpf),
        created_at: new Date().toISOString(),
      };

      await upsertUser(newDev);
      const pub = toPublicUser(newDev);
      persistSession(pub);
      toast.success("⚙️ Acesso DEV liberado! Bem-vindo, desenvolvedor!");
      return { success: true };
    },
    [persistSession],
  );

  // ── Registro padrão ────────────────────────────────────────────────────────
  const register = useCallback(
    async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
      if (!validateCPF(data.cpf))
        return { success: false, error: "CPF inválido. Verifique os dígitos." };

      // Verifica duplicatas
      const byCpf = await findUserByCpf(data.cpf);
      if (byCpf) return { success: false, error: "Este CPF já está cadastrado." };

      if (data.email) {
        const byEmail = await findUserByEmail(data.email);
        if (byEmail) return { success: false, error: "Este e-mail já está cadastrado." };
      }

      if (data.provider !== "google") {
        const pwCheck = validatePassword(data.password);
        if (!pwCheck.valid) return { success: false, error: pwCheck.errors.join(" • ") };
      }

      const newUser: DbUser = {
        id: `${data.role}_${Date.now()}`,
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        cpf: formatCPF(data.cpf),
        role: data.role,
        provider: data.provider || "local",
        avatar_url: data.avatarUrl,
        is_dev: data.isDev ?? false,
        password_hash: hashPassword(data.password),
        created_at: new Date().toISOString(),
        birth_date: data.birthDate,
        city: data.city,
        state: data.state,
        address: data.address,
        crf_number: data.crfNumber,
        pharmacy_name: data.pharmacyName,
        pharmacy_cnpj: data.pharmacyCnpj,
        branch: data.branch,
        pharmacy_phone: data.pharmacyPhone,
        specialty: data.specialty,
        stars: 0,
        rating_count: 0,
        patients_served: 0,
      };

      await upsertUser(newUser);
      const pub = toPublicUser(newUser);
      persistSession(pub);
      toast.success(`🎉 Cadastro realizado! Bem-vindo, ${data.nome}!`);
      return { success: true };
    },
    [persistSession],
  );

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    persistSession(null);
    toast.info("Até logo! 👋");
  }, [persistSession]);

  const fetchAllUsers = useCallback(async (): Promise<User[]> => {
    const dbUsers = await getAllUsers();
    return dbUsers.map(toPublicUser);
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    if (!currentUser?.cpf) return;
    const found = await findUserByCpf(currentUser.cpf);
    if (found) {
      persistSession(toPublicUser(found));
    }
  }, [currentUser?.cpf, persistSession]);

  const switchDevRole = useCallback(
    async (newRole: "farmaceutico" | "cliente"): Promise<void> => {
      if (!currentUser?.isDev) return;

      const existingDb = await findUserByCpf(currentUser.cpf);
      const updated: DbUser = existingDb
        ? {
            ...existingDb,
            role: newRole,
            pharmacy_name:
              newRole === "farmaceutico"
                ? existingDb.pharmacy_name || "Farmácia Central FarmaHero"
                : existingDb.pharmacy_name,
            branch:
              newRole === "farmaceutico"
                ? existingDb.branch || "Matriz Centro"
                : existingDb.branch,
            crf_number:
              newRole === "farmaceutico"
                ? existingDb.crf_number || "CRF/SP 48.912"
                : existingDb.crf_number,
            city: existingDb.city || "São Paulo",
            state: existingDb.state || "SP",
            specialty:
              newRole === "farmaceutico"
                ? existingDb.specialty || "Farmácia Clínica & Cuidados Integrados"
                : existingDb.specialty,
            stars: existingDb.stars ?? 0,
            rating_count: existingDb.rating_count ?? 0,
            patients_served: existingDb.patients_served ?? 0,
          }
        : {
            id: currentUser.id,
            nome: currentUser.nome,
            sobrenome: currentUser.sobrenome,
            email: currentUser.email,
            cpf: currentUser.cpf,
            role: newRole,
            provider: "local",
            is_dev: true,
            pharmacy_name: newRole === "farmaceutico" ? "Farmácia Central FarmaHero" : undefined,
            branch: newRole === "farmaceutico" ? "Matriz Centro" : undefined,
            crf_number: newRole === "farmaceutico" ? "CRF/SP 48.912" : undefined,
            city: "São Paulo",
            state: "SP",
            specialty: newRole === "farmaceutico" ? "Farmácia Clínica & Cuidados Integrados" : undefined,
            stars: 0,
            rating_count: 0,
            patients_served: 0,
            created_at: currentUser.createdAt,
          };

      await upsertUser(updated);
      const pub = toPublicUser(updated);
      persistSession(pub);
      toast.success(
        newRole === "farmaceutico"
          ? "🩺 Modo DEV: Você agora está atuando como Farmacêutico!"
          : "🦸 Modo DEV: Você agora está atuando como Paciente!",
      );
    },
    [currentUser, persistSession],
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        loginByCpf,
        loginWithGoogle,
        registerDev,
        register,
        logout,
        getAllUsers: fetchAllUsers,
        refreshUser,
        switchDevRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
};
