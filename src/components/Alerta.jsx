import { useEffect, useRef } from 'react'

// Mensagem integrada à interface (sucesso, erro, aviso ou informação).
// Se "fecharEm" (milissegundos) for informado junto com "onFechar", some sozinha.
export default function Alerta({ tipo = 'info', onFechar, fecharEm, children }) {
  const aoFechar = useRef(onFechar)
  aoFechar.current = onFechar

  useEffect(() => {
    if (!fecharEm) return undefined
    const temporizador = setTimeout(() => {
      if (aoFechar.current) aoFechar.current()
    }, fecharEm)
    return () => clearTimeout(temporizador)
  }, [fecharEm, children])

  return (
    <div className={`alerta alerta-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      <span className="alerta-texto">{children}</span>
      {onFechar && (
        <button type="button" className="alerta-fechar" onClick={onFechar} aria-label="Fechar mensagem">
          ×
        </button>
      )}
    </div>
  )
}
