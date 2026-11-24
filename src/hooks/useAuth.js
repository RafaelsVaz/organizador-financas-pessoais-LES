import { useEffect, useState } from 'react'
import { supabaseConfigurado } from '../services/supabaseClient.js'
import { obterSessao, observarSessao } from '../services/authService.js'

// Mantém o usuário logado. A sessão é restaurada ao atualizar a página.
export function useAuth() {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(supabaseConfigurado)

  useEffect(() => {
    if (!supabaseConfigurado) return undefined

    let ativo = true

    obterSessao()
      .then((sessao) => {
        if (ativo) setUsuario(sessao?.user ?? null)
      })
      .catch(() => {
        if (ativo) setUsuario(null)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    const cancelar = observarSessao((sessao) => {
      if (ativo) setUsuario(sessao?.user ?? null)
    })

    return () => {
      ativo = false
      cancelar()
    }
  }, [])

  return { usuario, carregando }
}
