import { useMemo, useState } from 'react'
import Alerta from '../components/Alerta.jsx'
import BarrasCategorias from '../components/BarrasCategorias.jsx'
import CartoesResumo from '../components/CartoesResumo.jsx'
import FormularioMovimentacao from '../components/FormularioMovimentacao.jsx'
import SeletorPeriodo from '../components/SeletorPeriodo.jsx'
import UltimasMovimentacoes from '../components/UltimasMovimentacoes.jsx'
import { useMovimentacoes } from '../hooks/useMovimentacoes.js'
import { agruparDespesasPorCategoria, calcularResumo } from '../utils/calculations.js'
import { descreverPeriodo, obterIntervalo } from '../utils/periodo.js'

const QUANTIDADE_RECENTES = 5

// Página inicial: indicadores, despesas por categoria e últimas movimentações do período.
export default function VisaoGeralPage({ usuario, aoNavegar }) {
  const [opcaoPeriodo, setOpcaoPeriodo] = useState('mes')
  const [personalizado, setPersonalizado] = useState({ startDate: '', endDate: '' })
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const intervalo = useMemo(() => obterIntervalo(opcaoPeriodo, personalizado), [opcaoPeriodo, personalizado])
  const intervaloInvalido = Boolean(intervalo.startDate && intervalo.endDate && intervalo.startDate > intervalo.endDate)

  const { movimentacoes, carregando, erro, recarregar } = useMovimentacoes(
    { type: 'all', category: 'all', startDate: intervalo.startDate, endDate: intervalo.endDate },
    !intervaloInvalido
  )

  const resumo = useMemo(() => calcularResumo(movimentacoes), [movimentacoes])
  const despesasPorCategoria = useMemo(() => agruparDespesasPorCategoria(movimentacoes), [movimentacoes])
  const descricaoPeriodo = descreverPeriodo(opcaoPeriodo, intervalo)

  function aoSalvar(texto) {
    setFormularioAberto(false)
    setMensagem(texto)
    recarregar() // recalcula indicadores e resumos com os dados atualizados
  }

  return (
    <>
      <div className="pagina-topo">
        <div>
          <h2 className="pagina-titulo">Resumo financeiro</h2>
          <p className="pagina-subtitulo">
            Os números abaixo se referem ao período: <strong>{descricaoPeriodo}</strong>
          </p>
        </div>
        <div className="pagina-acoes">
          <SeletorPeriodo
            opcao={opcaoPeriodo}
            aoMudarOpcao={setOpcaoPeriodo}
            personalizado={personalizado}
            aoMudarPersonalizado={setPersonalizado}
          />
          <button type="button" className="botao botao-primario" onClick={() => setFormularioAberto(true)}>
            + Nova movimentação
          </button>
        </div>
      </div>

      {mensagem && (
        <Alerta tipo="sucesso" onFechar={() => setMensagem('')} fecharEm={5000}>
          {mensagem}
        </Alerta>
      )}
      {intervaloInvalido && <Alerta tipo="aviso">A data inicial não pode ser posterior à data final.</Alerta>}
      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      <CartoesResumo resumo={resumo} descricaoPeriodo={descricaoPeriodo} carregando={carregando} />

      <div className="grade-visao">
        <section className="cartao">
          <h3 className="cartao-titulo">Despesas por categoria</h3>
          {carregando ? (
            <p className="texto-vazio">Carregando...</p>
          ) : (
            <BarrasCategorias categorias={despesasPorCategoria} />
          )}
        </section>

        <section className="cartao">
          <div className="cartao-cabecalho">
            <h3 className="cartao-titulo">Últimas movimentações</h3>
            <button type="button" className="botao-link" onClick={() => aoNavegar('movimentacoes')}>
              Ver todas as movimentações
            </button>
          </div>
          {carregando ? (
            <p className="texto-vazio">Carregando...</p>
          ) : (
            <UltimasMovimentacoes
              movimentacoes={movimentacoes.slice(0, QUANTIDADE_RECENTES)}
              aoCadastrar={() => setFormularioAberto(true)}
            />
          )}
        </section>
      </div>

      {formularioAberto && (
        <FormularioMovimentacao
          movimentacao={null}
          idUsuario={usuario.id}
          aoSalvar={aoSalvar}
          aoCancelar={() => setFormularioAberto(false)}
        />
      )}
    </>
  )
}
