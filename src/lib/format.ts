export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export const statusLabels: Record<string, string> = {
  received: "Lead Recebido",
  first_contact: "Primeiro Contato",
  proposal_sent: "Proposta Enviada",
  negotiation: "Negociação",
  closed: "Fechamento",
  lost: "Perdido",
};
