import { ROTULO_TIPO, TIPO_RECEITA } from '../utils/constants.js'
import { formatarData, formatarMoeda } from '../utils/formatters.js'

// Tabela com o histórico de movimentações e as ações de editar e excluir.
export default function TabelaMovimentacoes({ movimentacoes, aoEditar, aoExcluir }) {
  return (
    <div className="tabela-rolagem">
      <table className="tabela">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>Categoria</th>
            <th className="alinhar-direita">Valor</th>
            <th className="alinhar-direita">Ações</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((item) => {
            const receita = item.type === TIPO_RECEITA
            return (
              <tr key={item.id}>
                <td className="celula-descricao">{item.description}</td>
                <td>{formatarData(item.transaction_date)}</td>
                <td>
                  <span className={`selo ${receita ? 'selo-receita' : 'selo-despesa'}`}>{ROTULO_TIPO[item.type]}</span>
                </td>
                <td>{item.category}</td>
                <td className={`alinhar-direita valor ${receita ? 'valor-receita' : 'valor-despesa'}`}>
                  {formatarMoeda(item.amount)}
                </td>
                <td className="alinhar-direita">
                  <div className="acoes-linha">
                    <button type="button" className="botao botao-pequeno botao-secundario" onClick={() => aoEditar(item)}>
                      Editar
                    </button>
                    <button type="button" className="botao botao-pequeno botao-contorno-perigo" onClick={() => aoExcluir(item)}>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
