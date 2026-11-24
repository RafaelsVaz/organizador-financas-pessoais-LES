-- =====================================================================
-- Organizador de Finanças Pessoais - Esquema do banco de dados (Supabase)
-- Execute este arquivo inteiro no painel do Supabase:
--   SQL Editor > New query > cole o conteúdo > Run
-- O script pode ser executado mais de uma vez sem causar erro.
-- =====================================================================

-- 1) Tabela de movimentações ------------------------------------------
create table if not exists public.transactions (
  id               uuid          primary key default gen_random_uuid(),
  user_id          uuid          not null references auth.users (id) on delete cascade,
  description      text          not null check (char_length(btrim(description)) > 0),
  amount           numeric(12,2) not null check (amount > 0),
  type             text          not null check (type in ('income', 'expense')),
  category         text          not null check (category in (
                     'Alimentação', 'Transporte', 'Moradia', 'Saúde',
                     'Lazer', 'Salário', 'Outros'
                   )),
  transaction_date date          not null,
  created_at       timestamptz   not null default now()
);

comment on table  public.transactions        is 'Receitas e despesas de cada usuário.';
comment on column public.transactions.type   is 'income = receita, expense = despesa. O valor (amount) é sempre positivo.';

-- 2) Índice para consultas por usuário e data ---------------------------
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, transaction_date desc);

-- 3) Segurança: Row Level Security (RLS) --------------------------------
alter table public.transactions enable row level security;

-- Permissões básicas da tabela para usuários autenticados.
-- (Quem não está autenticado não recebe nenhuma permissão.)
grant select, insert, update, delete on public.transactions to authenticated;

-- Remove políticas antigas (permite executar o script novamente)
drop policy if exists "Usuário consulta as próprias movimentações"  on public.transactions;
drop policy if exists "Usuário cadastra as próprias movimentações"  on public.transactions;
drop policy if exists "Usuário altera as próprias movimentações"    on public.transactions;
drop policy if exists "Usuário exclui as próprias movimentações"    on public.transactions;

-- SELECT: só enxerga registros cujo user_id é o do usuário logado
create policy "Usuário consulta as próprias movimentações"
  on public.transactions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- INSERT: só pode criar registros vinculados a si mesmo
create policy "Usuário cadastra as próprias movimentações"
  on public.transactions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- UPDATE: só altera os próprios registros e não pode passá-los para outro usuário
create policy "Usuário altera as próprias movimentações"
  on public.transactions for update
  to authenticated
  using      ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- DELETE: só exclui os próprios registros
create policy "Usuário exclui as próprias movimentações"
  on public.transactions for delete
  to authenticated
  using ((select auth.uid()) = user_id);
