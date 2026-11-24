import { useState } from 'react'
import Modal from './Modal.jsx'
import Campo from './Campo.jsx'
import Alerta from './Alerta.jsx'
import { CATEGORIAS, TIPO_RECEITA, TIPO_DESPESA, ROTULO_TIPO } from '../utils/constants.js'
import { dataHojeISO } from '../utils/formatters.js'
import { validarMovimentacao } from '../utils/validations.js'
import { criarMovimentacao, atualizarMovimentacao } from '../services/transactionService.js'

function camposIniciais(movimentacao) {
  if (!movimentacao) {
    return {
      description: '',
      amount: '',
      transaction_date: dataHojeISO(),
      type: TIPO_DESPESA,
      category: ''
    }
  }
  return {
    description: movimentacao.description,
    amount: Number(movimentacao.amount).toFixed(2).replace('.', ','),
    transaction_date: movimentacao.transaction_date,
    type: movimentacao.type,
    category: movimentacao.category
  }
}

// Formulário para cadastrar (movimentacao = null) ou editar uma movimentação.
export default function FormularioMovimentacao({ movimentacao, idUsuario, aoSalvar, aoCancelar }) {
  const editando = Boolean(movimentacao)
  const [campos, setCampos] = useState(() => camposIniciais(movimentacao))
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [salvando, setSalvando] = useState(false)

  function alterar(nome, valor) {
    setCampos((atual) => ({ ...atual, [nome]: valor }))
    if (erros[nome]) setErros((atual) => ({ ...atual, [nome]: undefined }))
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErroGeral('')

    const resultado = validarMovimentacao(campos)
    if (!resultado.valido) {
      setErros(resultado.erros)
      return
    }

    setSalvando(true)
    try {
      if (editando) {
        await atualizarMovimentacao(movimentacao.id, resultado.dados)
        aoSalvar('Movimentação atualizada com sucesso.')
      } else {
        await criarMovimentacao(idUsuario, resultado.dados)
        aoSalvar('Movimentação cadastrada com sucesso.')
      }
    } catch (e) {
      setErroGeral(e.message)
      setSalvando(false)
    }
  }

  return (
    <Modal
      titulo={editando ? 'Editar movimentação' : 'Nova movimentação'}
      onFechar={aoCancelar}
      bloqueado={salvando}
    >
      <form onSubmit={enviar} noValidate>
        <div className="modal-corpo">
          {erroGeral && <Alerta tipo="erro">{erroGeral}</Alerta>}

          <div className="formulario-grade">
            <div className="coluna-inteira">
              <Campo id="mov-descricao" rotulo="Descrição" erro={erros.description}>
                <input
                  id="mov-descricao"
                  type="text"
                  value={campos.description}
                  onChange={(e) => alterar('description', e.target.value)}
                  maxLength={120}
                  placeholder="Ex.: Almoço no restaurante"
                  autoFocus
                />
              </Campo>
            </div>

            <Campo id="mov-valor" rotulo="Valor (R$)" erro={erros.amount} dica="Use vírgula para os centavos. Ex.: 1250,50">
              <input
                id="mov-valor"
                type="text"
                inputMode="decimal"
                value={campos.amount}
                onChange={(e) => alterar('amount', e.target.value)}
                placeholder="0,00"
              />
            </Campo>

            <Campo id="mov-data" rotulo="Data" erro={erros.transaction_date}>
              <input
                id="mov-data"
                type="date"
                value={campos.transaction_date}
                onChange={(e) => alterar('transaction_date', e.target.value)}
              />
            </Campo>

            <Campo rotulo="Tipo" erro={erros.type}>
              <div className="segmentado" role="group" aria-label="Tipo da movimentação">
                {[TIPO_RECEITA, TIPO_DESPESA].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    className={`segmento segmento-${tipo} ${campos.type === tipo ? 'ativo' : ''}`}
                    aria-pressed={campos.type === tipo}
                    onClick={() => alterar('type', tipo)}
                  >
                    {ROTULO_TIPO[tipo]}
                  </button>
                ))}
              </div>
            </Campo>

            <Campo id="mov-categoria" rotulo="Categoria" erro={erros.category}>
              <select
                id="mov-categoria"
                value={campos.category}
                onChange={(e) => alterar('category', e.target.value)}
              >
                <option value="">Selecione a categoria</option>
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
        </div>

        <div className="modal-rodape">
          <button type="button" className="botao botao-secundario" onClick={aoCancelar} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" className="botao botao-primario" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
