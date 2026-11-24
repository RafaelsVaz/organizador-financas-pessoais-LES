import { formatarMoeda } from '../utils/formatters.js'

// Três indicadores lado a lado: receitas, despesas e saldo do período.
export default function CartoesResumo({ resumo, descricaoPeriodo, carregando }) {
  const valor = (numero) => (carregando ? '...' : formatarMoeda(numero))

  return (
    <div className="cartoes-resumo">
      <article className="cartao indicador indicador-receita">
        <span className="indicador-titulo">Total de receitas</span>
        <strong className="indicador-valor">{valor(resumo.receitas)}</strong>
        <span className="indicador-periodo">{descricaoPeriodo}</span>
      </article>

      <article className="cartao indicador indicador-despesa">
        <span className="indicador-titulo">Total de despesas</span>
        <strong className="indicador-valor">{valor(resumo.despesas)}</strong>
        <span className="indicador-periodo">{descricaoPeriodo}</span>
      </article>

      <article className="cartao indicador indicador-saldo">
        <span className="indicador-titulo">Saldo</span>
        <strong className={`indicador-valor ${resumo.saldo < 0 ? 'valor-despesa' : ''}`}>{valor(resumo.saldo)}</strong>
        <span className="indicador-periodo">Receitas menos despesas · {descricaoPeriodo}</span>
      </article>
    </div>
  )
}
