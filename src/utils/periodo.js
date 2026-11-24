import { dataParaISO, formatarData } from './formatters.js'

// Opções de período da Visão geral.
export const OPCOES_PERIODO = [
  { valor: 'mes', rotulo: 'Este mês' },
  { valor: 'mesAnterior', rotulo: 'Mês anterior' },
  { valor: 'ano', rotulo: 'Este ano' },
  { valor: 'tudo', rotulo: 'Todo o período' },
  { valor: 'personalizado', rotulo: 'Período personalizado' }
]

// Devolve { startDate, endDate } (AAAA-MM-DD). Texto vazio = sem limite.
export function obterIntervalo(opcao, personalizado = {}, hoje = new Date()) {
  const ano = hoje.getFullYear()
  const mes = hoje.getMonth() // 0 a 11

  if (opcao === 'mes') {
    return {
      startDate: dataParaISO(new Date(ano, mes, 1)),
      endDate: dataParaISO(new Date(ano, mes + 1, 0))
    }
  }

  if (opcao === 'mesAnterior') {
    return {
      startDate: dataParaISO(new Date(ano, mes - 1, 1)),
      endDate: dataParaISO(new Date(ano, mes, 0))
    }
  }

  if (opcao === 'ano') {
    return {
      startDate: dataParaISO(new Date(ano, 0, 1)),
      endDate: dataParaISO(new Date(ano, 11, 31))
    }
  }

  if (opcao === 'personalizado') {
    return {
      startDate: personalizado.startDate || '',
      endDate: personalizado.endDate || ''
    }
  }

  return { startDate: '', endDate: '' } // "tudo"
}

// Texto que informa ao usuário a qual período os números se referem.
export function descreverPeriodo(opcao, intervalo) {
  const { startDate, endDate } = intervalo

  let datas
  if (startDate && endDate) datas = `${formatarData(startDate)} a ${formatarData(endDate)}`
  else if (startDate) datas = `a partir de ${formatarData(startDate)}`
  else if (endDate) datas = `até ${formatarData(endDate)}`
  else datas = 'todas as datas'

  if (opcao === 'personalizado') return datas
  const rotulo = OPCOES_PERIODO.find((o) => o.valor === opcao)?.rotulo
  return opcao === 'tudo' ? rotulo : `${rotulo} (${datas})`
}
