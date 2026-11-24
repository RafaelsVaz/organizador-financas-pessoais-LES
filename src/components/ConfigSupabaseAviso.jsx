// Tela exibida quando o arquivo .env ainda não foi preenchido.
// Nenhuma conexão é simulada: o sistema só funciona com o Supabase configurado.
export default function ConfigSupabaseAviso() {
  return (
    <main className="aviso-config">
      <section className="cartao aviso-config-cartao">
        <h1>Configure o Supabase para continuar</h1>
        <p>
          O <strong>Organizador de Finanças Pessoais</strong> guarda os dados no Supabase, mas as credenciais ainda não
          foram informadas neste computador.
        </p>
        <ol>
          <li>Na pasta principal do projeto, copie o arquivo <code>.env.example</code> e renomeie a cópia para <code>.env</code>.</li>
          <li>
            Abra o <code>.env</code> e preencha a URL do projeto e a chave pública (anon) do Supabase:
            <pre>{`VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_ANON`}</pre>
          </li>
          <li>Salve o arquivo, pare o sistema no terminal (Ctrl + C) e execute <code>npm run dev</code> novamente.</li>
        </ol>
        <p className="texto-secundario">
          Os passos completos, incluindo a criação da tabela com o arquivo <code>supabase/schema.sql</code>, estão no
          arquivo <code>README.md</code>.
        </p>
      </section>
    </main>
  )
}
