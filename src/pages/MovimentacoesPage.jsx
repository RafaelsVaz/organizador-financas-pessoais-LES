import { useState } from 'react'
import Alerta from '../components/Alerta.jsx'
import ConfirmarExclusao from '../components/ConfirmarExclusao.jsx'
import FiltrosMovimentacoes from '../components/FiltrosMovimentacoes.jsx'
import FormularioMovimentacao from '../components/FormularioMovimentacao.jsx'
import TabelaMovimentacoes from '../components/TabelaMovimentacoes.jsx'
import { useMovimentacoes } from '../hooks/useMovimentacoes.js'
import { excluirMovimentacao } from '../services/transactionService.js'

const FILTROS_INICIAIS = { type: 'all', category: 'all', startDate: '', endDate: '' }

// Histórico de movimentações com filtros, edição e exclusão.
export default function MovimentacoesPage({ usuario }) {
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS)
  const [formulario, setFormulario] = useState(null) // { movimentacao } (null = nova)
  const [paraExcluir, setParaExcluir] = useState(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')
  const [mensagem, setMensagem] = useState('')

  const temFiltros =
    filtros.type !== 'all' || filtros.category !== 'all' || Boolean(filtros.startDate) || Boolean(filtros.endDate)
  const intervaloInvalido = Boolean(filtros.startDate && filtros.endDate && filtros.startDate > filtros.endDate)

  const { movimentacoes, carregando, erro, recarregar } = useMovimentacoes(filtros, !intervaloInvalido)

  function aoSalvar(texto) {
    setFormulario(null)
    setMensagem(texto)
    recarregar()
  }

  function cancelarExclusao() {
    setParaExcluir(null)
    setErroExclusao('')
  }

  async function confirmarExclusao() {
    setExcluindo(true)
    setErroExclusao('')
    try {
      await excluirMovimentacao(paraExcluir.id)
      setParaExcluir(null)
      setMensagem('Movimentação excluída com sucesso.')
      recarregar()
    } catch (e) {
      setErroExclusao(e.message)
    } finally {
      setExcluindo(false)
    }
  }

  function renderizarLista() {
    if (intervaloInvalido) return null
    if (erro) return <Alerta tipo="erro">{erro}</Alerta>
    if (carregando) return <div className="estado-vazio">Carregando movimentações...</div>

    if (movimentacoes.length === 0) {
      return temFiltros ? (
        <div className="estado-vazio">
          <h3>Nenhum registro encontrado</h3>
          <p>Nenhuma movimentação corresponde aos filtros selecionados.</p>
          <button type="button" className="botao botao-secundario" onClick={() => setFiltros(FILTROS_INICIAIS)}>
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="estado-vazio">
          <h3>Nenhuma movimentação cadastrada</h3>
          <p>Cadastre sua primeira receita ou despesa para começar a acompanhar suas finanças.</p>
          <button type="button" className="botao botao-primario" onClick={() => setFormulario({ movimentacao: null })}>
            + Nova movimentação
          </button>
        </div>
      )
    }

    return (
      <TabelaMovimentacoes
        movimentacoes={movimentacoes}
        aoEditar={(item) => setFormulario({ movimentacao: item })}
        aoExcluir={(item) => setParaExcluir(item)}
      />
    )
  }

  return (
    <>
      <div className="pagina-topo">
        <div>
          <h2 className="pagina-titulo">Histórico de movimentações</h2>
          <p className="pagina-subtitulo">Consulte, edite e exclua suas receitas e despesas.</p>
        </div>
        <div className="pagina-acoes">
          <button type="button" className="botao botao-primario" onClick={() => setFormulario({ movimentacao: null })}>
            + Nova movimentação
          </button>
        </div>
      </div>

      {mensagem && (
        <Alerta tipo="sucesso" onFechar={() => setMensagem('')} fecharEm={5000}>
          {mensagem}
        </Alerta>
      )}

      <FiltrosMovimentacoes
        filtros={filtros}
        aoAlterar={setFiltros}
        aoLimpar={() => setFiltros(FILTROS_INICIAIS)}
        temFiltros={temFiltros}
      />

      {intervaloInvalido && <Alerta tipo="aviso">A data inicial não pode ser posterior à data final.</Alerta>}

      <section className="cartao cartao-tabela">
        <div className="cartao-cabecalho">
          <h3 className="cartao-titulo">
            Movimentações
            {!carregando && !erro && !intervaloInvalido && (
              <span className="contador">
                {movimentacoes.length} {movimentacoes.length === 1 ? 'registro' : 'registros'}
              </span>
            )}
          </h3>
          {temFiltros && <span className="selo selo-filtro">Filtros ativos</span>}
        </div>
        {renderizarLista()}
      </section>

      {formulario && (
        <FormularioMovimentacao
          movimentacao={formulario.movimentacao}
          idUsuario={usuario.id}
          aoSalvar={aoSalvar}
          aoCancelar={() => setFormulario(null)}
        />
      )}

      {paraExcluir && (
        <ConfirmarExclusao
          movimentacao={paraExcluir}
          excluindo={excluindo}
          erro={erroExclusao}
          aoConfirmar={confirmarExclusao}
          aoCancelar={cancelarExclusao}
        />
      )}
    </>
  )
}
