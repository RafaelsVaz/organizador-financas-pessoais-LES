import { supabase } from './supabaseClient.js'

// Converte as mensagens de erro do Supabase Auth para português.
function traduzirErroAuth(erro) {
  const msg = (erro?.message || '').toLowerCase()

  if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (msg.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada (e o spam).'
  }
  if (msg.includes('already registered') || msg.includes('already been registered')) {
    return 'Este e-mail já está cadastrado. Tente entrar.'
  }
  if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.'
  if (msg.includes('signups not allowed') || msg.includes('signup is disabled')) {
    return 'O cadastro de novas contas está desativado neste projeto do Supabase.'
  }
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.'
  }
  if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
    return 'Informe um e-mail válido.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Não foi possível conectar ao Supabase. Verifique sua internet e as credenciais do arquivo .env.'
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

export async function entrar(email, senha) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha
  })
  if (error) throw new Error(traduzirErroAuth(error))
}

// Retorna { precisaConfirmarEmail }.
// Se o Supabase exigir confirmação de e-mail, não há sessão após o cadastro.
export async function cadastrar(email, senha) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: senha
  })
  if (error) throw new Error(traduzirErroAuth(error))

  // Quando o e-mail já existe e a confirmação está ativa, o Supabase devolve
  // um usuário sem "identities" (para não revelar quais e-mails existem).
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error('Este e-mail já está cadastrado. Tente entrar.')
  }

  return { precisaConfirmarEmail: !data.session }
}

export async function sair() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('Não foi possível sair da conta. Tente novamente.')
}

export async function obterSessao() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// Avisa quando o usuário entra ou sai. Devolve uma função para cancelar a observação.
export function observarSessao(aoMudar) {
  const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => {
    aoMudar(sessao)
  })
  return () => data.subscription.unsubscribe()
}
