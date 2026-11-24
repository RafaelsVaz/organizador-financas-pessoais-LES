import { formatarMoeda } from '../utils/formatters.js'

// Resumo das despesas por categoria em barras horizontais (sem biblioteca de gráficos).
export default function BarrasCategorias({ categorias }) {
  if (categorias.length === 0) {
    return <p className="texto-vazio">Nenhuma despesa registrada no período.</p>
  }

  return (
    <ul className="barras">
      {categorias.map((item) => (
        <li key={item.categoria} className="barra-item">
          <div className="barra-cabecalho">
            <span className="barra-nome">{item.categoria}</span>
            <span className="barra-valor">
              {formatarMoeda(item.total)} <small>({item.percentual.toFixed(0)}%)</small>
            </span>
          </div>
          <div
            className="barra-trilho"
            role="img"
            aria-label={`${item.categoria}: ${item.percentual.toFixed(0)}% das despesas`}
          >
            <div className="barra-preenchimento" style={{ width: `${Math.max(item.percentual, 2)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
