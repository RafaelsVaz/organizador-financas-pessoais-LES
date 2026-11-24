import Modal from './Modal.jsx'
import Alerta from './Alerta.jsx'
import { formatarData, formatarMoeda } from '../utils/formatters.js'

// Pede confirmação antes de excluir. "Cancelar" não altera nada.
export default function ConfirmarExclusao({ movimentacao, excluindo, erro, aoConfirmar, aoCancelar }) {
  return (
    <Modal titulo="Excluir movimentação" onFechar={aoCancelar} bloqueado={excluindo} largura={480}>
      <div className="modal-corpo">
        {erro && <Alerta tipo="erro">{erro}</Alerta>}
        <p className="texto-confirmacao">Tem certeza de que deseja excluir esta movimentação? Esta ação não pode ser desfeita.</p>
        <div className="resumo-exclusao">
          <strong>{movimentacao.description}</strong>
          <span>
            {formatarData(movimentacao.transaction_date)} · {movimentacao.category} · {formatarMoeda(movimentacao.amount)}
          </span>
        </div>
      </div>
      <div className="modal-rodape">
        <button type="button" className="botao botao-secundario" onClick={aoCancelar} disabled={excluindo}>
          Cancelar
        </button>
        <button type="button" className="botao botao-perigo" onClick={aoConfirmar} disabled={excluindo}>
          {excluindo ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </Modal>
  )
}
