import { TIPO_RECEITA } from '../utils/constants.js'
import { formatarData, formatarMoeda } from '../utils/formatters.js'

// Lista pequena com as movimentações mais recentes do período.
export default function UltimasMovimentacoes({ movimentacoes, aoCadastrar }) {
  if (movimentacoes.length === 0) {
    return (
      <div className="estado-vazio estado-vazio-pequeno">
        <p>Nenhuma movimentação no período.</p>
        <button type="button" className="botao botao-primario" onClick={aoCadastrar}>
          Cadastrar movimentação
        </button>
      </div>
    )
  }

  return (
    <ul className="lista-recentes">
      {movimentacoes.map((item) => {
        const receita = item.type === TIPO_RECEITA
        return (
          <li key={item.id} className="recente-item">
            <div className="recente-info">
              <strong>{item.description}</strong>
              <span>
                {formatarData(item.transaction_date)} · {item.category}
              </span>
            </div>
            <span className={`valor ${receita ? 'valor-receita' : 'valor-despesa'}`}>{formatarMoeda(item.amount)}</span>
          </li>
        )
      })}
    </ul>
  )
}
