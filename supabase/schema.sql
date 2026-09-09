-- ================================================================
--  FarmHero — Schema do Banco de Dados (Supabase / PostgreSQL)
-- ================================================================
--  Como usar:
--  1. Acesse seu projeto no Supabase: https://supabase.com
--  2. Vá em "SQL Editor" no menu lateral
--  3. Cole TODO este conteúdo e clique em "Run"
-- ================================================================

-- ── Habilitar UUID ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ── Tabela de Usuários ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id           TEXT PRIMARY KEY,               -- gerado pelo frontend
  nome         TEXT NOT NULL,
  sobrenome    TEXT NOT NULL DEFAULT '',
  email        TEXT UNIQUE,                    -- pode ser NULL para login CPF
  cpf          TEXT UNIQUE NOT NULL,           -- obrigatório para todos
  role         TEXT NOT NULL DEFAULT 'cliente'
               CHECK (role IN ('farmaceutico', 'cliente', 'dev')),
  provider     TEXT NOT NULL DEFAULT 'local'
               CHECK (provider IN ('local', 'google', 'cpf')),
  avatar_url   TEXT,
  is_dev       BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash TEXT,                          -- para provider=local
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabela de Estado do Jogo por Usuário ────────────────────────
CREATE TABLE IF NOT EXISTS public.user_states (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  level               INTEGER NOT NULL DEFAULT 1,
  xp                  INTEGER NOT NULL DEFAULT 0,
  max_xp              INTEGER NOT NULL DEFAULT 100,
  coins               INTEGER NOT NULL DEFAULT 0,
  streak_days         INTEGER NOT NULL DEFAULT 0,
  equipped_hat        TEXT,
  equipped_outfit     TEXT,
  equipped_pet        TEXT,
  equipped_background TEXT,
  items               JSONB NOT NULL DEFAULT '[]',
  health_data         JSONB NOT NULL DEFAULT '{}',
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ── Índices para buscas rápidas ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_cpf   ON public.users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_states_user_id ON public.user_states(user_id);

-- ── Trigger: atualiza updated_at automaticamente ─────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER user_states_updated_at
  BEFORE UPDATE ON public.user_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security (RLS) — segurança básica ──────────────────
ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_states ENABLE ROW LEVEL SECURITY;

-- Permite leitura/escrita pública via chave anon (frontend-only app)
-- Em produção real, restringir por user_id com Supabase Auth
CREATE POLICY "public_users_all"       ON public.users       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_user_states_all" ON public.user_states FOR ALL USING (true) WITH CHECK (true);

-- ── Verificação ──────────────────────────────────────────────────
SELECT 'Tabelas criadas com sucesso! ✅' AS status;
