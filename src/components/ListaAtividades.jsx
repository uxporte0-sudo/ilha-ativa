// LEGACY - DO NOT USE in official MVP flows.
// Replaced by Ativo/Participacao official domain services.
import { ativosTipos } from "../constants/ativosTipos";

function buscarTipoAtivo(tipoId) {
  return ativosTipos.find((tipo) => tipo.id === tipoId);
}

function formatarData(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${data}T00:00:00`));
}

export default function ListaAtividades(atividades = [], usuarioId) {
  return atividades.map((atividade) => {
    const tipo = buscarTipoAtivo(atividade.tipo);
    const confirmados = atividade.confirmados ?? 0;
    const confirmadosUsuarios = atividade.confirmadosUsuarios ?? [];
    const confirmadoPeloUsuario = confirmadosUsuarios.includes(usuarioId);

    return {
      id: atividade.id,
      nome: atividade.nome,
      tipoLabel: tipo?.label ?? "Tipo não definido",
      icone: tipo?.ico ?? "?",
      dataFormatada: formatarData(atividade.data),
      confirmadosTexto: `${confirmados}/${atividade.minParticipantes} confirmados`,
      confirmados,
      confirmadosUsuarios,
      confirmadoPeloUsuario,
      minParticipantes: atividade.minParticipantes,
      acaoLabel: confirmadoPeloUsuario ? "Confirmado" : "Confirmar presença",
    };
  });
}
