// Campo de formulário: rótulo + controle + mensagem de erro.
// Se "id" for informado, o rótulo fica ligado ao controle (acessibilidade).
export default function Campo({ id, rotulo, erro, dica, children }) {
  return (
    <div className={`campo ${erro ? 'campo-com-erro' : ''}`}>
      {id ? (
        <label htmlFor={id} className="rotulo">
          {rotulo}
        </label>
      ) : (
        <span className="rotulo">{rotulo}</span>
      )}
      {children}
      {dica && !erro && <span className="campo-dica">{dica}</span>}
      {erro && <span className="campo-mensagem">{erro}</span>}
    </div>
  )
}
