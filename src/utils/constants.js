// Constantes usadas em todo o sistema.

// Categorias predefinidas (lista fixa, conforme o escopo do projeto).
// Devem ser idênticas às categorias aceitas em supabase/schema.sql.
export const CATEGORIAS = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Salário',
  'Outros'
]

// Valores gravados no banco para o tipo da movimentação.
export const TIPO_RECEITA = 'income'
export const TIPO_DESPESA = 'expense'

// Texto exibido ao usuário para cada tipo.
export const ROTULO_TIPO = {
  [TIPO_RECEITA]: 'Receita',
  [TIPO_DESPESA]: 'Despesa'
}
