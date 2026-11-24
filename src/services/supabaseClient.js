import { createClient } from '@supabase/supabase-js'

// Somente a URL do projeto e a chave PÚBLICA (anon) são usadas no navegador.
// NUNCA coloque a chave "service_role" neste projeto.
const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const chavePublica = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

// Verdadeiro apenas se o arquivo .env foi preenchido com valores reais.
export const supabaseConfigurado = Boolean(
  url &&
    chavePublica &&
    url.startsWith('http') &&
    !url.includes('SEU-PROJETO') &&
    !chavePublica.includes('SUA_CHAVE')
)

// Sem credenciais, o cliente não é criado (e nenhuma conexão é simulada).
export const supabase = supabaseConfigurado ? createClient(url, chavePublica) : null
