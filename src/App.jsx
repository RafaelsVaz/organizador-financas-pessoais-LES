import { useState } from 'react'
import ConfigSupabaseAviso from './components/ConfigSupabaseAviso.jsx'
import Layout from './components/Layout.jsx'
import { useAuth } from './hooks/useAuth.js'
import LoginPage from './pages/LoginPage.jsx'
import MovimentacoesPage from './pages/MovimentacoesPage.jsx'
import VisaoGeralPage from './pages/VisaoGeralPage.jsx'
import { supabaseConfigurado } from './services/supabaseClient.js'

export default function App() {
  const { usuario, carregando } = useAuth()
  const [pagina, setPagina] = useState('visao-geral')

  // 1) Sem credenciais no .env: explica o que fazer (não simula conexão)
  if (!supabaseConfigurado) return <ConfigSupabaseAviso />

  // 2) Verificando se já existe uma sessão ativa
  if (carregando) return <div className="tela-carregando">Carregando...</div>

  // 3) Ninguém logado: tela de login e cadastro
  if (!usuario) return <LoginPage />

  // 4) Usuário logado. A "key" reinicia as telas se outra conta entrar.
  return (
    <Layout key={usuario.id} pagina={pagina} aoNavegar={setPagina} usuario={usuario}>
      {pagina === 'visao-geral' ? (
        <VisaoGeralPage usuario={usuario} aoNavegar={setPagina} />
      ) : (
        <MovimentacoesPage usuario={usuario} />
      )}
    </Layout>
  )
}
