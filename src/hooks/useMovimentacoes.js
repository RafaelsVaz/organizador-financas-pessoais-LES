import { useCallback, useEffect, useState } from 'react'
import { listarMovimentacoes } from '../services/transactionService.js'

// Carrega as movimentações do usuário aplicando os filtros informados.
// Recarrega automaticamente quando os filtros mudam e, manualmente, com recarregar().
// Se "habilitado" for falso (ex.: filtro inválido), não consulta o banco.
export function useMovimentacoes(filtros, habilitado = true) {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [versao, setVersao] = useState(0)

  const { type, category, startDate, endDate } = filtros

  useEffect(() => {
    if (!habilitado) {
      setMovimentacoes([])
      setErro('')
      setCarregando(false)
      return undefined
    }

    let ativo = true
    setCarregando(true)
    setErro('')

    listarMovimentacoes({ type, category, startDate, endDate })
      .then((dados) => {
        if (ativo) setMovimentacoes(dados)
      })
      .catch((e) => {
        if (ativo) {
          setMovimentacoes([])
          setErro(e.message)
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    // Evita que uma resposta antiga sobrescreva uma consulta mais nova
    return () => {
      ativo = false
    }
  }, [type, category, startDate, endDate, habilitado, versao])

  const recarregar = useCallback(() => setVersao((v) => v + 1), [])

  return { movimentacoes, carregando, erro, recarregar }
}
