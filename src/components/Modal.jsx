import { useEffect } from 'react'

// Janela sobreposta (usada no formulário de movimentação e na confirmação de exclusão).
// Fecha com a tecla Esc ou clicando fora, exceto quando "bloqueado" (operação em andamento).
export default function Modal({ titulo, onFechar, bloqueado = false, largura = 680, children }) {
  useEffect(() => {
    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape' && !bloqueado) onFechar()
    }
    document.addEventListener('keydown', aoPressionarTecla)
    return () => document.removeEventListener('keydown', aoPressionarTecla)
  }, [onFechar, bloqueado])

  function aoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !bloqueado) onFechar()
  }

  return (
    <div className="modal-fundo" onMouseDown={aoClicarNoFundo}>
      <div className="modal" style={{ maxWidth: largura }} role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="modal-topo">
          <h2>{titulo}</h2>
          <button type="button" className="botao-icone" onClick={onFechar} disabled={bloqueado} aria-label="Fechar">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
