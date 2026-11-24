import Campo from './Campo.jsx'
import { CATEGORIAS, TIPO_RECEITA, TIPO_DESPESA } from '../utils/constants.js'

// Filtros combináveis: tipo, categoria e período (data inicial e final).
export default function FiltrosMovimentacoes({ filtros, aoAlterar, aoLimpar, temFiltros }) {
  function alterar(nome, valor) {
    aoAlterar({ ...filtros, [nome]: valor })
  }

  return (
    <section className="cartao filtros" aria-label="Filtros">
      <Campo id="filtro-tipo" rotulo="Tipo">
        <select id="filtro-tipo" value={filtros.type} onChange={(e) => alterar('type', e.target.value)}>
          <option value="all">Todas</option>
          <option value={TIPO_RECEITA}>Receitas</option>
          <option value={TIPO_DESPESA}>Despesas</option>
        </select>
      </Campo>

      <Campo id="filtro-categoria" rotulo="Categoria">
        <select id="filtro-categoria" value={filtros.category} onChange={(e) => alterar('category', e.target.value)}>
          <option value="all">Todas as categorias</option>
          {CATEGORIAS.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="filtro-inicio" rotulo="Data inicial">
        <input
          id="filtro-inicio"
          type="date"
          value={filtros.startDate}
          onChange={(e) => alterar('startDate', e.target.value)}
        />
      </Campo>

      <Campo id="filtro-fim" rotulo="Data final">
        <input
          id="filtro-fim"
          type="date"
          value={filtros.endDate}
          onChange={(e) => alterar('endDate', e.target.value)}
        />
      </Campo>

      <div className="filtros-acao">
        <button type="button" className="botao botao-secundario" onClick={aoLimpar} disabled={!temFiltros}>
          Limpar filtros
        </button>
      </div>
    </section>
  )
}
