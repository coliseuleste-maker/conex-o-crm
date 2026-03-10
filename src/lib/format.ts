export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);

export const statusLabels: Record<string, string> = {
  received: "Lead Recebido",
  first_contact: "Primeiro Contato",
  qualified: "Qualificado",
  unqualified: "Não Qualificado",
  proposal_sent: "Proposta Enviada",
  negotiation: "Negociação",
  closed: "Fechamento",
  lost: "Perdido",
};

export const qualificationLabels: Record<string, string> = {
  qualified: "Qualificado",
  unqualified: "Não Qualificado",
  needs_info: "Requer Info",
  pending: "Pendente",
};

export const teamRoleLabels: Record<string, string> = {
  sdr: "SDR",
  executive: "Executivo Comercial",
  manager: "Gestor Comercial",
};
