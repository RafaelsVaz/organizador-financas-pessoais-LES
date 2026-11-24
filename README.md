# Organizador de Finanças Pessoais

Sistema web para computador que ajuda uma pessoa a registrar **receitas e despesas**, organizar as movimentações por **categorias** e acompanhar o **saldo** e os **gastos** em um período.

Projeto acadêmico de Engenharia de Software, feito com **React + Vite + JavaScript**, CSS tradicional e **Supabase** (autenticação e banco de dados).

## O que o sistema faz

- Criar conta, entrar e sair (Supabase Auth); a sessão continua ao atualizar a página.
- Cadastrar, editar e excluir movimentações (descrição, valor, data, tipo e categoria).
- Consultar o histórico em tabela, do registro mais recente para o mais antigo.
- Filtrar por tipo, categoria e período (os filtros podem ser combinados).
- **Visão geral** com total de receitas, total de despesas, saldo, despesas por categoria e últimas movimentações do período escolhido.
- Cada usuário enxerga **somente os próprios dados** (garantido no banco por Row Level Security).

Categorias fixas: Alimentação, Transporte, Moradia, Saúde, Lazer, Salário e Outros.

---

## Como executar (passo a passo)

### 1. Instale o Node.js

É necessário ter o **Node.js** (versão 18 ou superior) e o **npm** instalados. O npm já vem junto com o Node.js.
Baixe em <https://nodejs.org> (versão LTS). Para conferir, abra um terminal e execute:

```bash
node -v
npm -v
```

### 2. Abra a pasta do projeto no VS Code

1. Extraia o arquivo ZIP (se for o caso).
2. No VS Code, vá em **Arquivo > Abrir Pasta...** e selecione a pasta principal `organizador-financas` (a que contém o `package.json`).

### 3. Abra o terminal dentro da pasta

No VS Code, use o menu **Terminal > Novo Terminal**. O terminal já abre na pasta do projeto.

### 4. Instale as dependências

```bash
npm install
```

(Precisa de internet. Pode levar alguns minutos na primeira vez.)

### 5. Crie ou selecione um projeto no Supabase

1. Acesse <https://supabase.com> e entre (ou crie uma conta gratuita).
2. Clique em **New project**, escolha um nome e uma senha para o banco e aguarde a criação.
   Se já tiver um projeto, basta abri-lo.

### 6. Crie a tabela do banco (`schema.sql`)

1. No painel do projeto, abra **SQL Editor** (menu lateral).
2. Clique em **New query**.
3. Abra o arquivo `supabase/schema.sql` do projeto, copie **todo** o conteúdo e cole no editor.
4. Clique em **Run**. Deve aparecer a mensagem de sucesso ("Success. No rows returned").

Isso cria a tabela `transactions`, o índice e as políticas de segurança (RLS). O script pode ser executado novamente sem problemas.

### 7. Copie a URL e a chave pública do Supabase

1. No painel, vá em **Project Settings > API** (em versões novas do painel, a seção pode se chamar **API Keys** / **Data API**).
2. Copie a **Project URL** (algo como `https://abcdefgh.supabase.co`).
3. Copie a chave **anon public** (em painéis mais novos pode aparecer como **publishable key**).

> ⚠️ Use **somente** a chave pública (anon/publishable). **Nunca** use a `service_role` / secret key neste projeto.

### 8. Crie o arquivo `.env`

1. Na pasta principal do projeto, copie o arquivo `.env.example` e renomeie a cópia para `.env`.
2. Abra o `.env` e substitua pelos valores copiados:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_ANON
```

O arquivo `.env` já está no `.gitignore`, portanto **não será enviado ao GitHub**.

### 9. Inicie a aplicação

```bash
npm run dev
```

### 10. Abra no navegador

Acesse: **<http://localhost:5173>**

Se o terminal mostrar outro endereço (por exemplo, outra porta), use o endereço indicado por ele.
Se você alterar o `.env` com o sistema rodando, pare-o com **Ctrl + C** e execute `npm run dev` de novo.

### 11. Teste o sistema

Siga o roteiro de testes manuais abaixo.

---

## Confirmação de e-mail no cadastro

Por padrão, o Supabase exige que o usuário **confirme o e-mail** antes do primeiro login. Nesse caso, depois de "Criar conta" o sistema avisa que é preciso verificar a caixa de entrada (e o spam).

Para facilitar os testes em desenvolvimento, você pode desativar essa exigência:
**Authentication > Sign In / Providers > Email > desative "Confirm email"** (o nome exato pode variar conforme a versão do painel). Com isso, a conta é criada e o login acontece imediatamente.

O envio de e-mails do plano gratuito tem limite de mensagens por hora; se aparecer a mensagem "Muitas tentativas", aguarde um pouco.

---

## Roteiro de testes manuais

Use duas contas de teste (A e B) para verificar o isolamento de dados.

| # | O que fazer | Resultado esperado |
|---|---|---|
| 1 | Abrir o sistema **sem** `.env` preenchido | Tela "Configure o Supabase para continuar" |
| 2 | Em "Criar conta", informar e-mail, senha e uma confirmação **diferente** | Mensagem "As senhas não coincidem." |
| 3 | Criar a conta A com dados válidos | Se a confirmação de e-mail estiver ativa: aviso para verificar a caixa de entrada. Se não: entra direto no sistema |
| 4 | Entrar com e-mail e senha **errados** | Mensagem "E-mail ou senha incorretos." |
| 5 | Entrar com a conta A | Abre a **Visão geral** com valores zerados e estado vazio |
| 6 | Atualizar a página (F5) | A sessão continua; o usuário não volta ao login |
| 7 | Clicar em **Sair** | Volta para a tela de login |
| 8 | Cadastrar uma **receita** (Salário, R$ 3.000,00, hoje) | Mensagem de sucesso; Visão geral mostra receitas R$ 3.000,00 |
| 9 | Cadastrar uma **despesa** (Alimentação, R$ 250,50, hoje) | Despesas R$ 250,50; saldo R$ 2.749,50; barra de "Alimentação" a 100% |
| 10 | Tentar salvar com campos vazios, valor `0`, valor `-10` e valor `abc` | Mensagens de erro em cada campo; nada é salvo |
| 11 | Em **Movimentações**, conferir a tabela | Registros do mais recente para o mais antigo; valores no formato `R$ 1.250,00` |
| 12 | Clicar em **Editar**, mudar o valor e salvar | Tabela e Visão geral mostram os dados atualizados |
| 13 | Clicar em **Excluir** e depois em **Cancelar** | O registro permanece |
| 14 | Clicar em **Excluir** e confirmar | O registro some; os totais são recalculados |
| 15 | Filtrar por **tipo = Despesas** | Só aparecem despesas; selo "Filtros ativos" visível |
| 16 | Filtrar por **categoria** e **período** ao mesmo tempo | Aparecem apenas registros que atendem a todos os filtros |
| 17 | Aplicar filtros sem resultados | Mensagem "Nenhum registro encontrado" e botão "Limpar filtros" |
| 18 | Inverter as datas (inicial maior que a final) | Aviso "A data inicial não pode ser posterior à data final." |
| 19 | Na Visão geral, trocar o período (Mês anterior, Este ano, Todo o período, Personalizado) | Indicadores e barras mudam e o texto do período é atualizado |
| 20 | Sair, entrar com a conta **B** | Não aparece nenhuma movimentação da conta A |
| 21 | (Opcional, no painel do Supabase) **Table Editor > transactions** | Cada linha tem o `user_id` do dono; **Authentication > Policies** mostra a RLS ativa com 4 políticas |
| 22 | Conferir a interface em um monitor widescreen | Menu lateral à esquerda, conteúdo ocupando o resto da largura, tudo em português |

---

## Estrutura de pastas

```text
organizador-financas/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # Peças reutilizáveis da interface
│   │   ├── Alerta.jsx
│   │   ├── BarrasCategorias.jsx
│   │   ├── Campo.jsx
│   │   ├── CartoesResumo.jsx
│   │   ├── ConfigSupabaseAviso.jsx
│   │   ├── ConfirmarExclusao.jsx
│   │   ├── FiltrosMovimentacoes.jsx
│   │   ├── FormularioMovimentacao.jsx
│   │   ├── Layout.jsx
│   │   ├── Modal.jsx
│   │   ├── SeletorPeriodo.jsx
│   │   ├── TabelaMovimentacoes.jsx
│   │   └── UltimasMovimentacoes.jsx
│   ├── hooks/             # Hooks do React
│   │   ├── useAuth.js             # usuário logado / sessão
│   │   └── useMovimentacoes.js    # carrega movimentações com filtros
│   ├── pages/             # Telas
│   │   ├── LoginPage.jsx
│   │   ├── VisaoGeralPage.jsx
│   │   └── MovimentacoesPage.jsx
│   ├── services/          # Comunicação com o Supabase
│   │   ├── supabaseClient.js
│   │   ├── authService.js
│   │   └── transactionService.js
│   ├── styles/            # CSS tradicional
│   │   ├── global.css
│   │   ├── layout.css
│   │   └── paginas.css
│   ├── utils/             # Funções puras (formatação, validação, cálculos)
│   │   ├── calculations.js
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── periodo.js
│   │   └── validations.js
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── schema.sql
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Como o código está organizado

- **`services/`**: único lugar que conversa com o Supabase (login, cadastro e CRUD de movimentações).
- **`utils/`**: funções simples e independentes da tela (formatar moeda e data, validar o formulário, calcular totais e períodos).
- **`hooks/`**: lógica de estado reutilizável (sessão do usuário e carregamento da lista).
- **`components/`** e **`pages/`**: a interface. Cada arquivo tem uma responsabilidade.
- Somente componentes funcionais e funções; não há classes JavaScript.

## Banco de dados e segurança

Tabela `transactions`:

| Coluna | Tipo | Observação |
|---|---|---|
| `id` | uuid | chave primária, gerada automaticamente |
| `user_id` | uuid | referência a `auth.users`, obrigatório |
| `description` | text | obrigatório |
| `amount` | numeric(12,2) | sempre **positivo** (`amount > 0`) |
| `type` | text | `income` (receita) ou `expense` (despesa) |
| `category` | text | uma das 7 categorias predefinidas |
| `transaction_date` | date | obrigatório |
| `created_at` | timestamptz | data/hora de criação |

- O tipo (`type`) é quem define se o valor é receita ou despesa; despesas **não** são guardadas como valores negativos.
- A **RLS** está ativada, com políticas de SELECT, INSERT, UPDATE e DELETE que só permitem acesso quando `user_id = auth.uid()`. Isso protege os dados no próprio banco, e não apenas na tela.
- O navegador usa somente a URL do projeto e a chave pública (anon). Nenhuma chave secreta é usada.

## Limitações conhecidas

- O Supabase devolve, por padrão, no máximo 1.000 linhas por consulta. Para uso pessoal e para a apresentação acadêmica isso é suficiente; para volumes maiores seria necessário paginar.
- As categorias são fixas, conforme o escopo do projeto.
- O projeto roda localmente; a publicação (por exemplo, na Vercel) não faz parte desta etapa.

## Scripts disponíveis

| Comando | Função |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Inicia o sistema em modo de desenvolvimento (http://localhost:5173) |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Visualiza localmente a versão gerada pelo build |
