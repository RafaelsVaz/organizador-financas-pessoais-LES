import { TIPO_RECEITA, TIPO_DESPESA } from './constants.js'

// Os cálculos são feitos em centavos (números inteiros) para evitar
// erros de arredondamento do JavaScript (ex.: 0.1 + 0.2).
function emCentavos(valor) {
  return Math.round(Number(valor) * 100)
}

// Total de receitas, total de despesas e saldo (receitas - despesas).
export function calcularResumo(movimentacoes) {
  let receitas = 0
  let despesas = 0

  for (const item of movimentacoes) {
    if (item.type === TIPO_RECEITA) receitas += emCentavos(item.amount)
    if (item.type === TIPO_DESPESA) despesas += emCentavos(item.amount)
  }

  return {
    receitas: receitas / 100,
    despesas: despesas / 100,
    saldo: (receitas - despesas) / 100
  }
}

// Soma das despesas por categoria, da maior para a menor.
// Cada item: { categoria, total, percentual } (percentual em relação ao total de despesas).
export function agruparDespesasPorCategoria(movimentacoes) {
  const porCategoria = {}
  let totalGeral = 0

  for (const item of movimentacoes) {
    if (item.type !== TIPO_DESPESA) continue
    const centavos = emCentavos(item.amount)
    porCategoria[item.category] = (porCategoria[item.category] || 0) + centavos
    totalGeral += centavos
  }

  return Object.entries(porCategoria)
    .map(([categoria, centavos]) => ({
      categoria,
      total: centavos / 100,
      percentual: totalGeral > 0 ? (centavos / totalGeral) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total)
}
