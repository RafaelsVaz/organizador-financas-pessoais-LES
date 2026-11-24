import { useState } from 'react'
import Alerta from '../components/Alerta.jsx'
import Campo from '../components/Campo.jsx'
import { entrar, cadastrar } from '../services/authService.js'
import { emailValido } from '../utils/validations.js'

// Tela de entrada: login e criação de conta (Supabase Auth).
export default function LoginPage() {
  const [modo, setModo] = useState('entrar') // 'entrar' ou 'cadastrar'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cadastrando = modo === 'cadastrar'

  function trocarModo(novoModo) {
    setModo(novoModo)
    setErros({})
    setErroGeral('')
    setSucesso('')
    setSenha('')
    setConfirmacao('')
  }

  function validar() {
    const novosErros = {}
    if (!email.trim()) novosErros.email = 'Informe o e-mail.'
    else if (!emailValido(email)) novosErros.email = 'Informe um e-mail válido.'

    if (!senha) novosErros.senha = 'Informe a senha.'
    else if (cadastrando && senha.length < 6) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.'

    if (cadastrando) {
      if (!confirmacao) novosErros.confirmacao = 'Confirme a senha.'
      else if (confirmacao !== senha) novosErros.confirmacao = 'As senhas não coincidem.'
    }
    return novosErros
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErroGeral('')
    setSucesso('')

    const novosErros = validar()
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    setEnviando(true)
    try {
      if (cadastrando) {
        const { precisaConfirmarEmail } = await cadastrar(email, senha)
        if (precisaConfirmarEmail) {
          // Não simulamos um cadastro concluído: o usuário precisa confirmar o e-mail.
          const enderecoCadastrado = email.trim()
          trocarModo('entrar')
          setSucesso(
            `Conta criada! Enviamos uma mensagem de confirmação para ${enderecoCadastrado}. Verifique sua caixa de entrada (e a pasta de spam) e confirme o e-mail antes de entrar.`
          )
        }
        // Sem confirmação de e-mail, o usuário já fica autenticado e o sistema abre sozinho.
      } else {
        await entrar(email, senha)
      }
    } catch (e) {
      setErroGeral(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <section className="login-lateral">
        <span className="marca-icone marca-icone-grande" aria-hidden="true">R$</span>
        <h1>Organizador de Finanças Pessoais</h1>
        <p>Registre suas receitas e despesas, organize por categorias e acompanhe seu saldo e seus gastos em cada período.</p>
      </section>

      <section className="login-painel">
        <div className="login-formulario">
          <div className="abas" role="tablist" aria-label="Acesso">
            <button
              type="button"
              role="tab"
              aria-selected={!cadastrando}
              className={`aba ${!cadastrando ? 'ativa' : ''}`}
              onClick={() => trocarModo('entrar')}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={cadastrando}
              className={`aba ${cadastrando ? 'ativa' : ''}`}
              onClick={() => trocarModo('cadastrar')}
            >
              Criar conta
            </button>
          </div>

          <h2>{cadastrando ? 'Crie sua conta' : 'Acesse sua conta'}</h2>

          {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}
          {erroGeral && <Alerta tipo="erro">{erroGeral}</Alerta>}

          <form onSubmit={enviar} noValidate>
            <Campo id="login-email" rotulo="E-mail" erro={erros.email}>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
              />
            </Campo>

            <Campo id="login-senha" rotulo="Senha" erro={erros.senha} dica={cadastrando ? 'Mínimo de 6 caracteres.' : undefined}>
              <input
                id="login-senha"
                type="password"
                autoComplete={cadastrando ? 'new-password' : 'current-password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </Campo>

            {cadastrando && (
              <Campo id="login-confirmacao" rotulo="Confirmar senha" erro={erros.confirmacao}>
                <input
                  id="login-confirmacao"
                  type="password"
                  autoComplete="new-password"
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value)}
                />
              </Campo>
            )}

            <button type="submit" className="botao botao-primario botao-largo" disabled={enviando}>
              {enviando ? 'Aguarde...' : cadastrando ? 'Criar conta' : 'Entrar'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
