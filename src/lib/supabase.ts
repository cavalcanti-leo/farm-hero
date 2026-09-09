import { createClient } from "@supabase/supabase-js";

// ── Supabase Client ─────────────────────────────────────────────────────────
// Preencha o .env com suas chaves do Supabase:
//   VITE_SUPABASE_URL  → https://SEU_PROJETO.supabase.co
//   VITE_SUPABASE_ANON_KEY → sua chave anon/public

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Verifica se as variáveis foram configuradas
export const isSupabaseConfigured =
  supabaseUrl &&
  supabaseUrl !== "https://SEU_PROJETO.supabase.co" &&
  supabaseAnonKey &&
  supabaseAnonKey !== "SUA_CHAVE_ANON_AQUI";

// Cria o cliente apenas se configurado
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase não configurado. Usando localStorage como fallback.\n" +
      "Para ativar o banco de dados:\n" +
      "1. Crie um projeto em https://supabase.com\n" +
      "2. Copie .env.example para .env e preencha as chaves",
  );
}
