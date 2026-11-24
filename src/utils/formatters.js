// Funções de formatação e conversão de valores e datas (padrão brasileiro).

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

// 1250 -> "R$ 1.250,00"
export function formatarMoeda(valor) {
  return formatadorMoeda.format(Number(valor) || 0)
}

// "2026-11-23" -> "23/11/2026" (sem usar Date, para evitar erro de fuso horário)
export function formatarData(dataISO) {
  if (!dataISO || typeof dataISO !== 'string') return ''
  const [ano, mes, dia] = dataISO.slice(0, 10).split('-')
  if (!ano || !mes || !dia) return ''
  return `${dia}/${mes}/${ano}`
}

function doisDigitos(numero) {
  return String(numero).padStart(2, '0')
}

// Date -> "AAAA-MM-DD" usando a data local do computador
export function dataParaISO(data) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`
}

export function dataHojeISO() {
  return dataParaISO(new Date())
}

// Converte o texto digitado pelo usuário em número.
// Aceita "1250", "1250,50", "1.250,50", "12.5" e "R$ 1.250,50".
// Retorna NaN quando o texto não é um valor válido (ou tem mais de 2 casas decimais).
export function converterValor(texto) {
  if (typeof texto === 'number') return texto

  let t = String(texto ?? '')
    .replace(/R\$/gi, '')
    .replace(/\s/g, '')

  if (!t) return NaN

  if (t.includes(',')) {
    // Padrão brasileiro: ponto separa milhares e vírgula separa os centavos
    t = t.replace(/\./g, '').replace(',', '.')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(t)) {
    // Ex.: "1.250" ou "1.250.000" -> milhares
    t = t.replace(/\./g, '')
  }

  if (!/^\d+(\.\d{1,2})?$/.test(t)) return NaN
  return Number(t)
}
