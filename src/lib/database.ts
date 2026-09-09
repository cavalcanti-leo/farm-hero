/**
 * FarmHero — Camada de acesso ao banco de dados (Supabase)
 * Com fallback automático para localStorage quando não configurado.
 */

import { supabase, isSupabaseConfigured } from "./supabase";

// ── Tipos espelham o schema SQL ──────────────────────────────────────────────

export interface DbUser {
  id: string;
  nome: string;
  sobrenome: string;
  email?: string;
  cpf: string;
  role: "farmaceutico" | "cliente" | "dev";
  provider: "local" | "google" | "cpf";
  avatar_url?: string;
  is_dev: boolean;
  password_hash: string;
  // Campos de Paciente e Farmacêutico
  birth_date?: string;
  city?: string;
  state?: string;
  address?: string;
  // Campos específicos do Farmacêutico
  crf_number?: string;
  pharmacy_name?: string;
  pharmacy_cnpj?: string;
  branch?: string;
  pharmacy_phone?: string;
  specialty?: string;
  stars?: number;
  rating_count?: number;
  patients_served?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExamRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientCpf?: string;
  patientBirthDate?: string;
  patientCity?: string;
  patientState?: string;
  pharmacistId: string;
  pharmacistName: string;
  pharmacyName?: string;
  branch?: string;
  examType: "Glicemia" | "Pressão Arterial" | "Aferição Geral" | "Revisão de Medicamentos";
  notes?: string;
  status: "pendente" | "avaliado";
  createdAt: string;
  evaluatedAt?: string;
  evaluationNotes?: string;
  evaluationMetrics?: {
    glucose?: number;
    systolic?: number;
    diastolic?: number;
    status: string;
    advice?: string;
  };
}

export interface PharmacistRating {
  id: string;
  pharmacistId: string;
  patientId: string;
  patientName: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

export interface RedeemedCoupon {
  id: string;
  userId: string;
  code: string;
  title: string;
  discount: string;
  costCoins: number;
  redeemedAt: string;
  expiresAt: string;
  used: boolean;
}

export interface DbUserState {
  user_id: string;
  level: number;
  xp: number;
  max_xp: number;
  coins: number;
  streak_days: number;
  equipped_hat: string | null;
  equipped_outfit: string | null;
  equipped_pet: string | null;
  equipped_background: string | null;
  items: unknown[];
  health_data: Record<string, unknown>;
}

// ── Chaves de localStorage (fallback) ───────────────────────────────────────

const LOCAL_USERS_KEY = "farmhero_users_v2";

function getLocalUsers(): DbUser[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalUsers(users: DbUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

// ════════════════════════════════════════════════════════════════
//  USUÁRIOS
// ════════════════════════════════════════════════════════════════

/** Salva (upsert) um usuário no banco ou localStorage */
export async function upsertUser(user: DbUser): Promise<void> {
  // 1. Sempre salva no localStorage (cache local instantâneo)
  const localUsers = getLocalUsers();
  const idx = localUsers.findIndex((u) => u.id === user.id);
  if (idx >= 0) localUsers[idx] = user;
  else localUsers.push(user);
  saveLocalUsers(localUsers);

  // 2. Se Supabase estiver configurado, salva na nuvem
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from("users").upsert(
    {
      id: user.id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email ?? null,
      cpf: user.cpf,
      role: user.role,
      provider: user.provider,
      avatar_url: user.avatar_url ?? null,
      is_dev: user.is_dev,
      password_hash: user.password_hash,
      birth_date: user.birth_date ?? null,
      city: user.city ?? null,
      state: user.state ?? null,
      address: user.address ?? null,
      crf_number: user.crf_number ?? null,
      pharmacy_name: user.pharmacy_name ?? null,
      pharmacy_cnpj: user.pharmacy_cnpj ?? null,
      branch: user.branch ?? null,
      pharmacy_phone: user.pharmacy_phone ?? null,
      specialty: user.specialty ?? null,
      stars: user.stars ?? 0,
      rating_count: user.rating_count ?? 0,
      patients_served: user.patients_served ?? 0,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("DB upsertUser error:", error.message);
  }
}

/** Busca todos os usuários — prioriza banco, cai no localStorage */
export async function getAllUsers(): Promise<DbUser[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      // Atualiza cache local com dados do banco
      saveLocalUsers(data as DbUser[]);
      return data as DbUser[];
    }
    if (error) console.warn("DB getAllUsers fallback to local:", error.message);
  }

  return getLocalUsers();
}

/** Busca usuário por CPF */
export async function findUserByCpf(cpf: string): Promise<DbUser | null> {
  const cpfClean = cpf.replace(/\D/g, "");

  if (isSupabaseConfigured && supabase) {
    // Busca com o CPF formatado e sem formatação
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`cpf.eq.${cpfClean},cpf.eq.${formatCPFDB(cpfClean)}`)
      .maybeSingle();

    if (!error && data) return data as DbUser;
    if (error) console.warn("DB findUserByCpf fallback:", error.message);
  }

  // Fallback localStorage
  const local = getLocalUsers();
  return local.find((u) => u.cpf.replace(/\D/g, "") === cpfClean) ?? null;
}

/** Busca usuário por e-mail */
export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const emailLower = email.toLowerCase();

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", emailLower)
      .maybeSingle();

    if (!error && data) return data as DbUser;
    if (error) console.warn("DB findUserByEmail fallback:", error.message);
  }

  const local = getLocalUsers();
  return local.find((u) => u.email?.toLowerCase() === emailLower) ?? null;
}

// ════════════════════════════════════════════════════════════════
//  ESTADO DO JOGO (progresso do usuário)
// ════════════════════════════════════════════════════════════════

/** Salva o estado do jogo de um usuário */
export async function upsertUserState(state: DbUserState): Promise<void> {
  // Cache local
  localStorage.setItem(`farmhero_state_${state.user_id}`, JSON.stringify(state));

  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from("user_states").upsert(state, { onConflict: "user_id" });

  if (error) console.error("DB upsertUserState error:", error.message);
}

/** Carrega o estado do jogo de um usuário */
export async function getUserState(userId: string): Promise<DbUserState | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("user_states")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      // Atualiza cache
      localStorage.setItem(`farmhero_state_${userId}`, JSON.stringify(data));
      return data as DbUserState;
    }
    if (error) console.warn("DB getUserState fallback:", error.message);
  }

  // Fallback localStorage
  try {
    const raw = localStorage.getItem(`farmhero_state_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Helper ──────────────────────────────────────────────────────────────────
function formatCPFDB(digits: string): string {
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

// ════════════════════════════════════════════════════════════════
//  SOLICITAÇÕES DE EXAMES (Paciente ⇄ Farmacêutico)
// ════════════════════════════════════════════════════════════════

const EXAM_REQUESTS_KEY = "farmhero_exam_requests_v2";

export function getExamRequests(): ExamRequest[] {
  try {
    return JSON.parse(localStorage.getItem(EXAM_REQUESTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveExamRequest(request: ExamRequest): void {
  const list = getExamRequests();
  const idx = list.findIndex((r) => r.id === request.id);
  if (idx >= 0) list[idx] = request;
  else list.unshift(request);
  localStorage.setItem(EXAM_REQUESTS_KEY, JSON.stringify(list));
}

// ════════════════════════════════════════════════════════════════
//  AVALIAÇÕES DE FARMACÊUTICOS (Estrelas dadas por Pacientes)
// ════════════════════════════════════════════════════════════════

const RATINGS_KEY = "farmhero_pharmacist_ratings_v2";

export function getPharmacistRatings(pharmacistId?: string): PharmacistRating[] {
  try {
    const list: PharmacistRating[] = JSON.parse(localStorage.getItem(RATINGS_KEY) || "[]");
    if (pharmacistId) return list.filter((r) => r.pharmacistId === pharmacistId);
    return list;
  } catch {
    return [];
  }
}

export async function addPharmacistRating(
  rating: Omit<PharmacistRating, "id" | "createdAt">,
): Promise<PharmacistRating> {
  const newRating: PharmacistRating = {
    ...rating,
    id: `rate_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const list = getPharmacistRatings();
  list.unshift(newRating);
  localStorage.setItem(RATINGS_KEY, JSON.stringify(list));

  // Recalcula a média de estrelas do farmacêutico no banco/localStorage
  const allForPharm = list.filter((r) => r.pharmacistId === rating.pharmacistId);
  const avgStars = Number(
    (allForPharm.reduce((acc, curr) => acc + curr.stars, 0) / allForPharm.length).toFixed(1),
  );

  const localUsers = getLocalUsers();
  const pharm = localUsers.find((u) => u.id === rating.pharmacistId);
  if (pharm) {
    pharm.stars = avgStars;
    pharm.rating_count = allForPharm.length;
    await upsertUser(pharm);
  }

  return newRating;
}

export async function incrementPharmacistPatients(pharmacistId: string): Promise<void> {
  const localUsers = getLocalUsers();
  const pharm = localUsers.find((u) => u.id === pharmacistId);
  if (pharm) {
    pharm.patients_served = (pharm.patients_served || 0) + 1;
    await upsertUser(pharm);
  }
}

// ════════════════════════════════════════════════════════════════
//  CUPONS DE RECOMPENSA (Troca de Moedas)
// ════════════════════════════════════════════════════════════════

const COUPONS_KEY = "farmhero_redeemed_coupons_v2";

export function getRedeemedCoupons(userId?: string): RedeemedCoupon[] {
  try {
    const list: RedeemedCoupon[] = JSON.parse(localStorage.getItem(COUPONS_KEY) || "[]");
    if (userId) return list.filter((c) => c.userId === userId);
    return list;
  } catch {
    return [];
  }
}

export function saveRedeemedCoupon(coupon: RedeemedCoupon): void {
  const list = getRedeemedCoupons();
  list.unshift(coupon);
  localStorage.setItem(COUPONS_KEY, JSON.stringify(list));
}

