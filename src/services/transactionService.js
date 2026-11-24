import { supabase } from './supabaseClient.js'

const TABELA = 'transactions'

// Converte erros do banco em mensagens compreensíveis.
function traduzirErro(erro, acao) {
  const codigo = erro?.code || ''
  const msg = (erro?.message || '').toLowerCase()

  if (codigo === 'PGRST205' || codigo === '42P01' || msg.includes('could not find the table')) {
    return "A tabela 'transactions' não foi encontrada. Execute o arquivo supabase/schema.sql no painel do Supabase."
  }
  if (codigo === '42501' || msg.includes('row-level security')) {
    return 'Você não tem permissão para realizar esta operação. Entre novamente na sua conta.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Não foi possível conectar ao Supabase. Verifique sua conexão com a internet.'
  }
  return `Não foi possível ${acao}. Tente novamente.`
}

// Busca as movimentações do usuário logado (a RLS garante que só vêm as dele).
// filtros: { type: 'all' | 'income' | 'expense', category: 'all' | nome, startDate, endDate }
// Ordem: data mais recente primeiro.
export async function listarMovimentacoes(filtros = {}) {
  let consulta = supabase.from(TABELA).select('*')

  if (filtros.type && filtros.type !== 'all') consulta = consulta.eq('type', filtros.type)
  if (filtros.category && filtros.category !== 'all') consulta = consulta.eq('category', filtros.category)
  if (filtros.startDate) consulta = consulta.gte('transaction_date', filtros.startDate)
  if (filtros.endDate) consulta = consulta.lte('transaction_date', filtros.endDate)

  const { data, error } = await consulta
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error(traduzirErro(error, 'carregar as movimentações'))

  // O valor é guardado como número; Number() garante o tipo correto no código.
  return data.map((item) => ({ ...item, amount: Number(item.amount) }))
}

// dados: { description, amount, type, category, transaction_date }
export async function criarMovimentacao(idUsuario, dados) {
  const { error } = await supabase.from(TABELA).insert({
    ...dados,
    user_id: idUsuario
  })
  if (error) throw new Error(traduzirErro(error, 'cadastrar a movimentação'))
}

export async function atualizarMovimentacao(id, dados) {
  const { data, error } = await supabase.from(TABELA).update(dados).eq('id', id).select()
  if (error) throw new Error(traduzirErro(error, 'salvar as alterações'))
  if (!data || data.length === 0) {
    throw new Error('Movimentação não encontrada. Ela pode ter sido excluída.')
  }
}

export async function excluirMovimentacao(id) {
  const { data, error } = await supabase.from(TABELA).delete().eq('id', id).select()
  if (error) throw new Error(traduzirErro(error, 'excluir a movimentação'))
  if (!data || data.length === 0) {
    throw new Error('Movimentação não encontrada. Ela pode já ter sido excluída.')
  }
}
