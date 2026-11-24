import { OPCOES_PERIODO } from '../utils/periodo.js'

// Seleção do período da Visão geral (Este mês, Mês anterior, Este ano, etc.).
export default function SeletorPeriodo({ opcao, aoMudarOpcao, personalizado, aoMudarPersonalizado }) {
  return (
    <div className="seletor-periodo">
      <label htmlFor="periodo-opcao" className="rotulo">
        Período
      </label>
      <select id="periodo-opcao" value={opcao} onChange={(e) => aoMudarOpcao(e.target.value)}>
        {OPCOES_PERIODO.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>

      {opcao === 'personalizado' && (
        <>
          <label htmlFor="periodo-inicio" className="rotulo">
            De
          </label>
          <input
            id="periodo-inicio"
            type="date"
            value={personalizado.startDate}
            onChange={(e) => aoMudarPersonalizado({ ...personalizado, startDate: e.target.value })}
          />
          <label htmlFor="periodo-fim" className="rotulo">
            até
          </label>
          <input
            id="periodo-fim"
            type="date"
            value={personalizado.endDate}
            onChange={(e) => aoMudarPersonalizado({ ...personalizado, endDate: e.target.value })}
          />
        </>
      )}
    </div>
  )
}
