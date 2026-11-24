import { useState } from 'react'
import { sair } from '../services/authService.js'

const ITENS_MENU = [
  { id: 'visao-geral', rotulo: 'Visão geral' },
  { id: 'movimentacoes', rotulo: 'Movimentações' }
]

// Estrutura das telas internas: menu lateral + cabeçalho + conteúdo.
export default function Layout({ pagina, aoNavegar, usuario, children }) {
  const [saindo, setSaindo] = useState(false)
  const [erroSair, setErroSair] = useState('')

  async function aoSair() {
    setSaindo(true)
    setErroSair('')
    try {
      await sair()
    } catch (e) {
      setErroSair(e.message)
      setSaindo(false)
    }
  }

  const titulo = ITENS_MENU.find((item) => item.id === pagina)?.rotulo

  return (
    <div className="app">
      <aside className="menu-lateral">
        <div className="marca">
          <span className="marca-icone" aria-hidden="true">R$</span>
          <span className="marca-nome">Organizador de Finanças Pessoais</span>
        </div>

        <nav aria-label="Menu principal">
          <ul className="menu-lista">
            {ITENS_MENU.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`menu-item ${pagina === item.id ? 'ativo' : ''}`}
                  aria-current={pagina === item.id ? 'page' : undefined}
                  onClick={() => aoNavegar(item.id)}
                >
                  {item.rotulo}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="principal">
        <header className="cabecalho">
          <h1 className="cabecalho-titulo">{titulo}</h1>
          <div className="cabecalho-conta">
            {erroSair && <span className="cabecalho-erro">{erroSair}</span>}
            <div className="conta-info">
              <span className="conta-rotulo">Conta</span>
              <span className="conta-email">{usuario.email}</span>
            </div>
            <button type="button" className="botao botao-secundario" onClick={aoSair} disabled={saindo}>
              {saindo ? 'Saindo...' : 'Sair'}
            </button>
          </div>
        </header>

        <main className="conteudo">{children}</main>
      </div>
    </div>
  )
}
