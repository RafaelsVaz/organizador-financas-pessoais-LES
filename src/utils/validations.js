import { CATEGORIAS, TIPO_RECEITA, TIPO_DESPESA } from './constants.js'
import { converterValor } from './formatters.js'

const VALOR_MAXIMO = 1000000000 // 1 bilhão (limite de segurança do campo numérico)

function dataValida(dataISO) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) return false
  const [ano, mes, dia] = dataISO.split('-').map(Number)
  if (ano < 1900 || ano > 2100) return false
  const data = new Date(ano, mes - 1, dia)
  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  )
}

// Valida os campos do formulário de movimentação.
// Entrada: { description, amount, transaction_date, type, category } (tudo texto)
// Saída:   { valido, erros, dados } - "dados" já vem pronto para ser enviado ao banco.
export function validarMovimentacao(campos) {
  const erros = {}

  const descricao = (campos.description || '').trim()
  if (!descricao) {
    erros.description = 'Informe a descrição.'
  } else if (descricao.length > 120) {
    erros.description = 'A descrição deve ter no máximo 120 caracteres.'
  }

  const textoValor = String(campos.amount ?? '').trim()
  const valor = converterValor(textoValor)
  if (!textoValor) {
    erros.amount = 'Informe o valor.'
  } else if (Number.isNaN(valor)) {
    erros.amount = 'Informe um valor numérico válido, com até duas casas decimais. Ex.: 1250,50.'
  } else if (valor <= 0) {
    erros.amount = 'O valor deve ser maior que zero.'
  } else if (valor >= VALOR_MAXIMO) {
    erros.amount = 'O valor informado é muito alto.'
  }

  if (!campos.transaction_date) {
    erros.transaction_date = 'Informe a data.'
  } else if (!dataValida(campos.transaction_date)) {
    erros.transaction_date = 'Informe uma data válida.'
  }

  if (campos.type !== TIPO_RECEITA && campos.type !== TIPO_DESPESA) {
    erros.type = 'Selecione o tipo: receita ou despesa.'
  }

  if (!campos.category) {
    erros.category = 'Selecione a categoria.'
  } else if (!CATEGORIAS.includes(campos.category)) {
    erros.category = 'Selecione uma categoria da lista.'
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
    dados: {
      description: descricao,
      amount: valor,
      type: campos.type,
      category: campos.category,
      transaction_date: campos.transaction_date
    }
  }
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim())
}
